# DB 스키마

> Database: MongoDB

---

## User

| 필드 | 타입 | 제약 | 설명 |
|------|------|------|------|
| `_id` | ObjectId | PK | 자동 생성 |
| `student_id` | String | required, unique | 학번 |
| `password_hash` | String | required | 암호화된 비밀번호 |
| `name` | String | required | 이름 |
| `grade` | Int | required | 학년 |
| `major` | String | required | 전공 |
| `created_at` | Date | required, default: now | 회원가입 일시 |
| `email` | String | required | 이메일 |
| `role` | String | required, enum: admin/user | 사용자 권한 |

---

## Board

| 필드 | 타입 | 제약 | 설명 |
|------|------|------|------|
| `_id` | ObjectId | PK | 자동 생성 |
| `board_name` | String | required | 게시판 이름 |
| `target_grade` | Int | - | 대상 학년 |
| `target_major` | String | - | 대상 전공 |

---

## Post

| 필드 | 타입 | 제약 | 설명 |
|------|------|------|------|
| `_id` | ObjectId | PK | 자동 생성 |
| `board_id` | ObjectId | required, ref: Board | 어떤 게시판인지 |
| `user_id` | ObjectId | required, ref: User | 작성자 |
| `title` | String | required | 게시글 제목 |
| `content` | String | required | 게시글 내용 |
| `view_count` | Int | required, default: 0 | 조회수 |
| `created_at` | Date | required, default: now | 작성 시간 |
| `updated_at` | Date | - | 수정 시간 |
| `like_count` | Int | required, default: 0 | 좋아요 수 |
| `is_deleted` | Boolean | required, default: false | 삭제 여부 |

---

## Comment

| 필드 | 타입 | 제약 | 설명 |
|------|------|------|------|
| `_id` | ObjectId | PK | 자동 생성 |
| `post_id` | ObjectId | required, ref: Post | 어떤 게시글의 댓글인지 |
| `user_id` | ObjectId | required, ref: User | 댓글 작성자 |
| `content` | String | required | 댓글 내용 |
| `created_at` | Date | required, default: now | 작성 시간 |
| `updated_at` | Date | - | 수정 시간 |
| `parent_comment_id` | ObjectId | -, ref: Comment | 대댓글 ID |
| `is_deleted` | Boolean | required, default: false | 삭제 여부 |

---

## Like

| 필드 | 타입 | 제약 | 설명 |
|------|------|------|------|
| `_id` | ObjectId | PK | 자동 생성 |
| `post_id` | ObjectId | required, ref: Post | 어떤 게시글인지 |
| `user_id` | ObjectId | required, ref: User | 누가 눌렀는지 |

> `post_id + user_id` 복합 unique 인덱스 적용 (중복 좋아요 방지)

---

## Notice

| 필드 | 타입 | 제약 | 설명 |
|------|------|------|------|
| `_id` | ObjectId | PK | 자동 생성 |
| `list_no` | Int | required, unique | 공지 고유 ID |
| `title` | String | required | 공지 제목 |
| `content` | String | - | 공지 본문 |
| `author` | String | required | 작성자 |
| `created_at` | Date | required | 등록일 |
| `view_count` | Int | required, default: 0 | 조회수 |
| `source_url` | String | required | 원본 공지 URL |
| `is_pinned` | Boolean | required, default: false | 상단 고정 공지 여부 |
| `crawled_at` | Date | required, default: now | 크롤링 시각 |
| `updated_at` | Date | - | 업데이트 시간 |

---

## NoticeAttachment

| 필드 | 타입 | 제약 | 설명 |
|------|------|------|------|
| `_id` | ObjectId | PK | 자동 생성 |
| `notice_id` | ObjectId | required, ref: Notice | 어떤 공지에 속한 파일인지 |
| `file_name` | String | required | 첨부파일 이름 |
| `file_url` | String | required | 첨부파일 다운로드 URL |
| `file_type` | String | required | 파일 형식 (pdf, hwp 등) |

---

## 관계 다이어그램

```
User ──< Post (user_id)
User ──< Comment (user_id)
User ──< Like (user_id)
Board ──< Post (board_id)
Post ──< Comment (post_id)
Post ──< Like (post_id)
Comment ──< Comment (parent_comment_id, 대댓글)
Notice ──< NoticeAttachment (notice_id)
```
