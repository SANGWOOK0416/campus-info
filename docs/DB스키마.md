# DB 스키마

> Database: MongoDB (Mongoose ODM)

---

## User

| 필드 | 타입 | 제약 | 설명 |
|------|------|------|------|
| `_id` | ObjectId | PK | 자동 생성 |
| `username` | String | required, unique | 사용자 이름 |
| `email` | String | required, unique | 이메일 |
| `password` | String | required | bcrypt 해시 저장 |
| `createdAt` | Date | auto | 가입일 |
| `updatedAt` | Date | auto | 수정일 |

---

## Post

| 필드 | 타입 | 제약 | 설명 |
|------|------|------|------|
| `_id` | ObjectId | PK | 자동 생성 |
| `title` | String | required | 게시글 제목 |
| `content` | String | required | 게시글 내용 |
| `author` | ObjectId | ref: User | 작성자 |
| `comments` | Array | - | 댓글 목록 (아래 참고) |
| `createdAt` | Date | auto | 작성일 |
| `updatedAt` | Date | auto | 수정일 |

### Post.comments (Embedded)

| 필드 | 타입 | 설명 |
|------|------|------|
| `_id` | ObjectId | 자동 생성 |
| `author` | ObjectId (ref: User) | 댓글 작성자 |
| `content` | String | 댓글 내용 |
| `createdAt` | Date | 작성일 |

---

## Notice

| 필드 | 타입 | 제약 | 설명 |
|------|------|------|------|
| `_id` | ObjectId | PK | 자동 생성 |
| `title` | String | required | 공지 제목 |
| `content` | String | - | 공지 내용 |
| `source` | String | - | 출처 (예: 학생처) |
| `url` | String | required, unique | 원본 URL |
| `crawledAt` | Date | default: now | 크롤링 시각 |
| `createdAt` | Date | auto | 생성일 |
| `updatedAt` | Date | auto | 수정일 |

---

## 관계 다이어그램

```
User ──< Post (author)
User ──< Post.comments (author)
Notice  (크롤러가 생성, User와 무관)
```
