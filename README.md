# 🏛️ Campus-Board 통합 시스템 아키텍처 및 트랜잭션 흐름도
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
