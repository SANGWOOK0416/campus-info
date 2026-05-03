## 3. 설계

### 3.1 데이터베이스 설계 (클래스 다이어그램)

MongoDB를 사용하며 Mongoose ODM으로 스키마를 정의합니다. 컬렉션 간의 연관 관계는 `ObjectId`를 활용한 참조(Reference) 방식으로 설계하였으며, 게시글 및 댓글 컬렉션에는 데이터 복구 가능성을 고려하여 물리적 삭제 대신 Soft Delete 방식을 적용했습니다.
```mermaid
classDiagram
    class User {
        +ObjectId _id
        +String auth0_id
        +String student_id
        +String name
        +Number grade
        +String major
        +String email
        +String role
        +Date created_at
    }
    class Post {
        +ObjectId _id
        +ObjectId board_id
        +ObjectId user_id
        +String title
        +String content
        +Number view_count
        +Number like_count
        +Boolean is_deleted
        +Date created_at
        +Date updated_at
    }
    class Notice {
        +ObjectId _id
        +Number list_no
        +String title
        +String content
        +String author
        +Number view_count
        +String source_url
        +Boolean is_pinned
        +Date crawled_at
    }
    class Comment {
        +ObjectId _id
        +ObjectId post_id
        +ObjectId user_id
        +String content
        +Boolean is_deleted
        +Date created_at
        +Date updated_at
    }
    class Like {
        +ObjectId _id
        +ObjectId post_id
        +ObjectId user_id
        +Date created_at
    }

    User "1" -- "N" Post : 작성 (writes)
    User "1" -- "N" Comment : 작성 (writes)
    User "1" -- "N" Like : 클릭 (clicks)
    Post "1" -- "N" Comment : 포함 (contains)
    Post "1" -- "N" Like : 받음 (receives)
```

---

### 3.2 백엔드 API 및 인증 아키텍처 설계

Auth0를 활용한 JWT 기반 인증 체계를 구축하고, 커스텀 미들웨어를 통해 API 서버의 보안을 강화했습니다. 

**주요 API 엔드포인트 명세**

| 기능 분류 | 메서드 | 경로 | 인증 | 설명 |
|---|---|---|---|---|
| **유저 연동** | POST | `/api/auth/sync` | 필요 | Auth0 토큰 정보와 클라이언트 데이터를 결합하여 DB에 동기화(Upsert) |
| **게시판 조회** | GET | `/api/posts` | 불필요 | 전체 게시글 목록 조회 (is_deleted: false 필터링 적용) |
| **게시글 작성** | POST | `/api/posts` | 필요 | 신규 글 작성 (ObjectId 규격 강제 변환 검증 포함) |
| **게시글 삭제** | DELETE | `/api/posts/:id` | 필요 | 작성자 권한 검증 후 상태값 변경 (Soft Delete) |
| **좋아요 기능** | POST | `/api/posts/:id/like`| 필요 | 특정 게시글 좋아요 토글 (동시성 제어 적용) |
| **실시간 알림** | GET | `/api/notifications/stream`| 필요 | SSE 방식 단방향 실시간 알림 연결 (새 공지, 댓글 알림) |

---

### 3.3 통합 순서 다이어그램 (Sequence Diagram)

**작성자:** 임상욱 (통합 아키텍처 및 시퀀스 정의)

본 다이어그램은 프로젝트의 전체 라이프사이클을 나타냅니다. 클라이언트의 로그인 및 인증(Auth0)부터 서버의 실시간 알림 연결(SSE), 게시판의 핵심 비즈니스 로직(CRUD 및 동시성 제어), 그리고 백그라운드에서 동작하는 스케줄러 기반의 공지사항 크롤링(웹 스크래핑) 과정까지 모든 시스템의 상호작용을 통합하여 시각화했습니다.
```mermaid
sequenceDiagram
    autonumber
    actor User as 사용자
    participant FE as Frontend (React/Vue 등)
    participant Auth0 as Auth0 (Identity Provider)
    participant Cron as Scheduler (node-cron)
    participant Crawler as Web Crawler (Axios/Cheerio)
    participant Server as Backend API & SSE
    participant DB as MongoDB Atlas

    %% --- 1단계: 인증 및 실시간 알림 파이프라인 연결 ---
    Note over User, DB: 📍 [Phase 1] Auth0 인증, 유저 동기화 및 SSE 연결 설정
    User->>FE: 로그인 요청
    FE->>Auth0: 인증 처리 및 JWT 발급
    Auth0-->>FE: JWT (Access Token) 반환
    FE->>Server: 유저 동기화 (POST /api/auth/sync)
    Server->>DB: 유저 정보 Upsert (중복 방지 저장)
    
    FE->>Server: 실시간 알림 연결 요청 (GET /api/notifications/stream) + JWT
    Note over Server: 미들웨어 통과 후 auth0_id로 DB 유저 조회
    Server->>Server: sseManager에 클라이언트 등록 (addClient)
    Server-->>FE: 연결 성공 응답 (text/event-stream) 및 Keep-alive 유지

    %% --- 2단계: 백그라운드 크롤링 및 전체 알림 (팀원 파트 연동) ---
    Note over Cron, DB: 📍 [Phase 2] 공지사항 크롤링 자동화 및 실시간 Broadcast 알림
    Cron->>Crawler: 매일 오전 8시 크롤러 실행 트리거
    Crawler->>Crawler: 동국대 컴퓨터공학과 공지/채용 HTML Fetch
    Crawler->>DB: 기존 공지 존재 여부 확인 (findOne by list_no)
    alt 새로운 공지사항일 경우
        Crawler->>DB: 새 공지사항 Insert (Notice 생성)
        Crawler->>Server: notifyNewNotice() 호출
        Server-->>FE: SSE Broadcast 이벤트 발송 (new_notice)
        FE->>User: "새로운 공지가 등록되었습니다" 화면 알림
    else 이미 존재하는 공지일 경우
        Crawler->>DB: 조회수(view_count) 및 수정일자만 Update
    end

    %% --- 3단계: 게시판 핵심 기능 (상욱 파트) ---
    Note over User, DB: 📍 [Phase 3] 게시판 로직 (데이터 정합성 및 동시성 제어)
    User->>FE: 게시글 작성 요청
    FE->>Server: POST /api/posts
    Server->>DB: Mongoose ObjectId 검증 후 Insert (is_deleted: false)
    DB-->>Server: 201 Created

    par 다중 유저 좋아요 동시 요청
        User->>Server: 좋아요 토글 (POST /api/posts/{id}/like)
    end
    Note over Server, DB: MongoDB $addToSet 원자적 연산을 통한 동시성 문제 해결
    Server->>DB: 좋아요 배열 업데이트

    User->>FE: 게시글 삭제 요청
    FE->>Server: DELETE /api/posts/{id}
    Server->>DB: 물리적 삭제 대신 상태값 변경 (is_deleted: true) 적용 (Soft Delete)

    %% --- 4단계: 댓글 작성 및 타겟팅 알림 (통합 시너지) ---
    Note over User, DB: 📍 [Phase 4] 유저 인터랙션 및 타겟팅 알림 (Targeted Notification)
    actor UserB as 다른 사용자
    UserB->>Server: 상욱이의 게시글에 댓글 작성 (POST /api/comments)
    Server->>DB: 댓글 저장 및 post_id 관계 매핑
    Server->>Server: notifyNewComment(게시글 작성자 ID, 댓글 내용) 호출
    Server-->>FE: 게시글 작성자(상욱)의 SSE 스트림으로만 이벤트 발송
    FE->>User: "내 게시글에 새 댓글이 달렸습니다" 화면 알림
```

---

### 3.4 핵심 알고리즘 및 비즈니스 로직 처리 흐름

보안 검증, 데이터 정합성 확인, 동시성 제어 등의 백엔드 예외 처리 로직이 포함된 처리 흐름입니다.

**1. 유저 동기화(Sync) 흐름**
```text
함수 handleUserSync(req, res):
  토큰 = req.headers.authorization
  만약 인증실패(토큰, Audience 누락 검증):
    반환 403 Forbidden
  
  // 중복 데이터 방지를 위한 Upsert 전략 적용
  유저정보 = DB.User.findOneAndUpdate(
    { auth0_id: 토큰.sub }, 
    { $set: req.body }, 
    { upsert: true, new: true }
  )
  반환 201 Created
```

**2. 좋아요 처리 (동시성 제어) 흐름**
```text
함수 handleToggleLike(req, res):
  // MongoDB $addToSet을 활용한 원자적 연산 (다중 요청 시 Lock 없이 무결성 보장)
  업데이트결과 = DB.Post.updateOne(
    { _id: 게시글ID },
    { $addToSet: { liked_users: 요청유저ID } }
  )

  만약 업데이트결과.수정됨 == 0:
    // 이미 좋아요를 누른 상태라면 배열에서 제거 ($pull)
    DB.Post.updateOne({ _id: 게시글ID }, { $pull: { liked_users: 요청유저ID } })
  
  반환 200 OK
```

---

## 4. 구현

### 4.1 구현 환경

| 항목 | 내용 |
|------|------|
| 개발 언어 | JavaScript (Node.js 24.11) |
| 프레임워크 | Express.js 4.22 |
| 데이터베이스 | MongoDB Atlas, Mongoose 8.23 |
| 인증 및 보안 | Auth0 (express-oauth2-jwt-bearer) |
| 서버 구조 | REST API 기반 Client-Server 아키텍처 |

### 4.2 핵심 구현 내용

**1. 유저 동기화 (Upsert 적용)**
로그인 시마다 데이터를 새로 생성하지 않고, `upsert: true` 옵션을 사용하여 데이터베이스의 일관성을 유지합니다.
```javascript
router.post('/sync', authMiddleware, async (req, res) => {
  const { student_id, major, name } = req.body;
  const user = await User.findOneAndUpdate(
    { auth0_id: req.user.sub },
    { student_id, major, name },
    { upsert: true, new: true }
  );
  res.status(201).json(user);
});
```

**2. 데이터 영속성을 위한 Soft Delete 적용**
사용자가 게시글을 삭제하더라도 DB에서 완전히 지우지 않고, `is_deleted` 플래그를 `true`로 변경하여 추후 데이터 복구나 관리가 가능하도록 안전망을 구현하였습니다.
```javascript
const post = await Post.findById(req.params.id);
if (post.user_id.toString() !== user._id.toString()) {
  return res.status(403).json({ message: '삭제 권한이 없습니다.' });
}
post.is_deleted = true; // 논리적 삭제
await post.save();
res.status(204).send();
```
}
```
