# 🏛️ Campus-Info 통합 시스템 아키텍처 및 트랜잭션 흐름도
**작성자:** 임상욱 (통합 시스템 시퀀스 정의)

본 다이어그램은 사용자가 프론트엔드(Client)에서 발생시키는 이벤트부터, Auth0 인증, 백엔드의 데이터 검증 및 비즈니스 로직 처리, 그리고 최종적으로 MongoDB Atlas에 적재되고 다시 화면에 렌더링되기까지의 전 과정을 나타냅니다.
```mermaid
sequenceDiagram
    autonumber
    actor User as 사용자
    participant FE as Frontend 
    participant Auth0 as Auth0 (Identity Provider)
    participant BE as Backend Server 
    participant DB as MongoDB Atlas 

    %% --- 1단계: 로그인 및 상태 관리 ---
    Note over User, DB: 📍 [Phase 1] 사용자 접속, 인증 및 글로벌 상태 저장
    User->>FE: 서비스 접속 및 로그인 버튼 클릭
    FE->>Auth0: Auth0 로그인 페이지 리다이렉트
    Auth0-->>FE: 인증 완료 및 JWT (Access Token) 발급
    FE->>FE: 발급받은 토큰 및 유저 정보를 전역 상태(State)에 저장

    %% --- 2단계: 유저 정보 백엔드 동기화 ---
    Note over FE, DB: 📍 [Phase 2] 프론트-백엔드 유저 데이터 동기화 (Sync)
    FE->>BE: 유저 동기화 API 호출 (POST /api/auth/sync) + JWT 헤더
    Note over BE: 커스텀 인증 미들웨어 검증<br/>(Audience 및 토큰 무결성 확인)
    BE->>DB: 유저 정보 Upsert 연산 (학번, 전공 등 맵핑)
    DB-->>BE: 중복 방지 및 저장 완료
    BE-->>FE: 201 Created 응답
    FE->>User: 메인 대시보드 화면 렌더링 및 접근 허용

    %% --- 3단계: 게시판 핵심 기능 (프론트 ➔ 서버 연동) ---
    Note over User, DB: 📍 [Phase 3] 게시판 기능 양방향 통신 (CRUD)
    User->>FE: 게시글 내용 입력 후 '작성' 클릭
    FE->>BE: 게시글 데이터 전송 (POST /api/posts)
    Note over BE: Mongoose 스키마 검증 로직<br/>(board_id ➔ ObjectId 변환 처리)
    BE->>DB: 게시글 데이터 Insert (is_deleted: false)
    DB-->>BE: 저장 완료
    BE-->>FE: 201 Created (생성된 데이터 객체 반환)
    FE->>FE: 상태 업데이트 및 게시판 목록 리렌더링
    FE->>User: 작성 완료된 게시글 화면 노출

    %% --- 4단계: 동시성 제어 및 상태 업데이트 ---
    Note over User, DB: 📍 [Phase 4] 유저 인터랙션 (좋아요/댓글) 및 Soft Delete
    User->>FE: 좋아요 버튼 클릭
    FE->>BE: 좋아요 토글 API 호출
    Note over BE, DB: MongoDB $addToSet 연산 적용<br/>(다중 요청 시 동시성 제어)
    BE-->>FE: 업데이트된 좋아요 카운트 반환
    FE->>User: UI에 애니메이션 및 숫자 즉각 반영 (Optimistic UI)

    User->>FE: 본인 게시글 '삭제' 클릭
    FE->>BE: 게시글 삭제 API 호출 (DELETE)
    BE->>BE: 사용자 본인 확인 및 권한 검증
    BE->>DB: Soft Delete 처리 (is_deleted: true)
    DB-->>BE: 업데이트 완료
    BE-->>FE: 204 No Content
    FE->>FE: 화면(DOM)에서 해당 게시글 숨김 처리
