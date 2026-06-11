# 14주차: 커뮤니티 게시판 고도화 및 관리자 대시보드 확장

## 1. 수행 목표
- 기존 10주차 코드베이스(`webplatform_w10`)의 **커뮤니티 기능을 고도화**하여 카테고리 분류, 좋아요 토글, 페이지네이션, 인기글 사이드바, 게시글 수정/삭제 등 실질적인 커뮤니티 운영 기능을 완성.
- **관리자 대시보드를 확장**하여 Recharts 기반 시각화 차트(일별 가입자 추이, 구독 분포, 카테고리별 게시글), 유저 역할 변경/차단, 게시글 숨김/삭제 등 운영 관리 기능을 구현.
- DB 스키마를 확장하여 `post_likes` 테이블 신규, `posts`에 `category/is_pinned/is_hidden` 컬럼, `users`에 `is_banned` 컬럼을 추가하고, In-Memory Mock 쿼리 파서도 동기화.

## 2. 개발 내역

### 2.1. DB 스키마 확장 및 Mock 쿼리 파서 고도화

#### 2.1.1. PostgreSQL 스키마 변경
- [db.js](../webplatform_w10/server/src/config/db.js):
  - `posts` 테이블에 `category VARCHAR(50) DEFAULT 'free'`, `is_pinned BOOLEAN DEFAULT false`, `is_hidden BOOLEAN DEFAULT false`, `updated_at TIMESTAMP` 컬럼 추가
  - `users` 테이블에 `is_banned BOOLEAN DEFAULT false` 컬럼 추가
  - `comments` 테이블에 `is_hidden BOOLEAN DEFAULT false` 컬럼 추가
  - `post_likes` 테이블 신규 생성: `post_id + user_id` UNIQUE 제약으로 중복 좋아요 방지
  - `idx_posts_category`, `idx_post_likes_post` 인덱스 추가
  - 게임 시딩 데이터에 **Marvel Rivals** 추가 (총 8개 게임)

#### 2.1.2. In-Memory Mock 쿼리 파서 확장
- [db.js](../webplatform_w10/server/src/config/db.js):
  - `post_likes` 테이블: SELECT(좋아요 여부 확인), INSERT(좋아요 추가), DELETE(좋아요 제거), COUNT(좋아요 수) 쿼리 핸들러 추가
  - `posts` 테이블: 카테고리 필터링(`WHERE category = $1`), 페이지네이션(`LIMIT/OFFSET`), 수정(`UPDATE title/content/category`), 숨김 토글(`UPDATE is_hidden`), 좋아요 수 증감 쿼리 핸들러 추가
  - `users` 테이블: 역할 변경(`UPDATE role`), 차단 토글(`UPDATE is_banned`) 쿼리 핸들러 추가
  - `comments` 테이블: 단건 조회(`SELECT WHERE id = $1`) 쿼리 핸들러 추가

#### 2.1.3. Mock 시딩 데이터 확장
- [mockDb.js](../webplatform_w10/server/src/config/mockDb.js):
  - 게시글 시딩 데이터 **3개 → 15개**로 대폭 확장 (4개 카테고리별 균등 분배)
  - 각 게시글에 `category`, `is_pinned`, `is_hidden`, `updated_at` 필드 추가
  - 댓글 시딩 데이터 **3개 → 12개**로 확장
  - `post_likes` 배열 신규 추가 (좋아요 수 기반 자동 생성)
  - 관리자 계정(`admin@syncrig.com`)에 **실제 해시된 비밀번호** 설정 (비밀번호: `Admin123`)
  - 게임 목록에 **Marvel Rivals** 추가 (총 8개)

---

### 2.2. 커뮤니티 기능 고도화

#### 2.2.1. 백엔드 — postController.js 전면 재작성
- [postController.js](../webplatform_w10/server/src/controllers/postController.js):
  - `getPosts`: 카테고리 필터(`?category=tips`), 페이지네이션(`?page=1&limit=10`), 정렬(`?sort=latest|popular`) 지원
  - `getPostById`: 조회수 자동 증가 + JWT 기반 좋아요 여부 확인(`user_liked`)
  - `createPost`: 카테고리 유효성 검사(`free/tips/hardware/bug`)
  - `updatePost` **(신규)**: 작성자 본인 또는 admin만 수정 가능
  - `deletePost` **(신규)**: 작성자 본인 또는 admin만 삭제 가능 (기존에는 admin만)
  - `toggleLike` **(신규)**: `post_likes` 테이블 기반 좋아요/좋아요 취소 토글
  - `deleteComment` **(신규)**: 작성자 본인 또는 admin만 댓글 삭제 가능 (기존에는 admin만)

#### 2.2.2. 백엔드 — postRoutes.js 확장
- [postRoutes.js](../webplatform_w10/server/src/routes/postRoutes.js):
  - `PUT /:id` — 게시글 수정
  - `DELETE /:id` — 게시글 삭제
  - `POST /:id/like` — 좋아요 토글
  - `DELETE /comments/:commentId` — 댓글 삭제

#### 2.2.3. 프론트엔드 — CommunityPage.jsx 전면 재작성
- [CommunityPage.jsx](../webplatform_w10/client/src/pages/CommunityPage.jsx):
  - **카테고리 탭 UI**: 전체/자유💬/팁💡/하드웨어🖥️/버그🐛 5개 탭 (클릭 시 필터링 + 페이지 리셋)
  - **카테고리 뱃지**: 게시글 목록에서 카테고리별 색상 뱃지 표시 (tips=초록, hardware=파랑, bug=빨강)
  - **페이지네이션**: 하단 페이지 번호 네비게이션 + 이전/다음 버튼
  - **인기글 사이드바**: 우측에 좋아요 순 상위 5개 게시글 표시 (1~3위 금색 강조)
  - **고정글 표시**: `is_pinned` 게시글에 📌 핀 아이콘 표시
  - **댓글 수 표시**: 각 게시글에 댓글 개수 노출

#### 2.2.4. 프론트엔드 — PostDetail.jsx 고도화
- [PostDetail.jsx](../webplatform_w10/client/src/pages/PostDetail.jsx):
  - **좋아요 토글 버튼**: 로그인 유저에게 좋아요/좋아요 취소 동적 UI (활성: 파란색 Fill, 비활성: 회색 Outline)
  - **수정 버튼**: 작성자 본인에게만 표시 → 클릭 시 `/community/edit/:id`로 이동
  - **삭제 버튼**: 작성자 본인 + admin에게 표시 → 확인 다이얼로그 후 삭제
  - **댓글 삭제**: 각 댓글에 작성자/admin용 🗑️ 아이콘 표시
  - **카테고리 뱃지**: 게시글 상단에 카테고리 표시

#### 2.2.5. 프론트엔드 — PostWritePage.jsx (신규)
- [PostWritePage.jsx](../webplatform_w10/client/src/pages/PostWritePage.jsx) **(신규 파일)**:
  - **작성/수정 겸용 페이지**: URL에 `:id` 파라미터 유무로 작성/수정 모드 자동 전환
  - **카테고리 선택 그리드**: 4개 카테고리를 2×2 버튼 그리드로 표시 (선택 시 파란색 강조)
  - **제목/내용 입력 폼**: maxLength 제한, 취소/등록 버튼

---

### 2.3. 관리자 대시보드 확장

#### 2.3.1. 백엔드 — adminController.js 전면 재작성
- [adminController.js](../webplatform_w10/server/src/controllers/adminController.js):
  - `getStats` **(고도화)**: 기존 단순 카운트에 더해 일별 가입자 추이(14일), 구독 티어 분포(Free/Premium), 카테고리별 게시글 분포, 전일 대비 신규 유저 수, PRO 전환율 계산
  - `updateUserRole` **(신규)**: `user ↔ admin` 역할 전환 API
  - `banUser` **(신규)**: 유저 차단/차단 해제 토글 API
  - `hidePost` **(신규)**: 게시글 숨김/숨김 해제 토글 API
  - `getBusinessMetrics` **(신규)**: 30일 단위 일별 가입자 추이, 일별 게시글 작성 추이, 구독 전환율

#### 2.3.2. 백엔드 — adminRoutes.js 확장
- [adminRoutes.js](../webplatform_w10/server/src/routes/adminRoutes.js):
  - `PATCH /users/:id/role` — 유저 역할 변경
  - `PATCH /users/:id/ban` — 유저 차단/해제
  - `PATCH /posts/:id/hide` — 게시글 숨김/해제
  - `GET /metrics` — 비즈니스 지표

#### 2.3.3. 프론트엔드 — AdminDashboard.jsx 전면 재작성
- [AdminDashboard.jsx](../webplatform_w10/client/src/pages/AdminDashboard.jsx):
  - **탭 UI**: 📊 개요 / 👥 유저 관리 / 📝 게시물 관리 3개 탭
  - **개요 탭**:
    - KPI 카드 4개: 총 유저 수(+오늘 신규), PRO 전환율, 총 게시물, 최적화 프로필 수
    - **Recharts LineChart**: 일별 가입자 추이 (14일, 파란색 라인)
    - **Recharts PieChart**: 구독 티어 분포 (Free vs Premium 도넛 차트)
    - **Recharts BarChart**: 카테고리별 게시글 분포 (4색 바 차트)
  - **유저 관리 탭**:
    - 검색 입력 필드 (이메일/닉네임 실시간 필터)
    - 필터 버튼: 전체/관리자/PRO/차단
    - 유저 테이블: 닉네임, 이메일, 계정 타입, 구독 상태, 권한, 관리 버튼
    - 🛡️ 역할 변경 버튼 (user ↔ admin 토글)
    - 🚫 차단/해제 버튼 (차단 시 행 반투명 처리)
  - **게시물 관리 탭**:
    - 게시물 테이블: 제목, 작성자, 카테고리, 좋아요, 조회수, 상태
    - 👁️ 숨김/해제 토글 버튼
    - 🗑️ 삭제 버튼

---

### 2.4. 프론트엔드 API 클라이언트 및 라우팅 확장

#### 2.4.1. apiClient.js 함수 추가
- [apiClient.js](../webplatform_w10/client/src/api/apiClient.js):
  - 커뮤니티: `getPosts(category, page, sort)`, `updatePost()`, `deletePost()`, `togglePostLike()`, `deleteComment()`
  - 관리자: `getAdminStats()`, `getAdminUsers(search, filter)`, `updateUserRole()`, `toggleUserBan()`, `togglePostVisibility()`, `deletePostByAdmin()`, `deleteCommentByAdmin()`, `getBusinessMetrics()`

#### 2.4.2. App.jsx 라우팅 추가
- [App.jsx](../webplatform_w10/client/src/App.jsx):
  - `/community/write` → `PostWritePage` (새 글 작성)
  - `/community/edit/:id` → `PostWritePage` (글 수정)

---

## 3. 변경 파일 목록

| 파일 | 유형 | 변경 내용 요약 |
|:---|:---:|:---|
| `server/src/config/db.js` | 수정 | posts에 category/is_pinned/is_hidden, users에 is_banned, post_likes 테이블, Mock 파서 확장 |
| `server/src/config/mockDb.js` | 수정 | 15개 게시글, 12개 댓글, 좋아요 데이터, Marvel Rivals 추가, admin 비밀번호 해시 |
| `server/src/controllers/postController.js` | 수정 | 카테고리/페이지네이션/정렬/좋아요/수정/삭제/댓글삭제 |
| `server/src/routes/postRoutes.js` | 수정 | PUT, DELETE, POST(like), DELETE(comments) 라우트 |
| `server/src/controllers/adminController.js` | 수정 | 차트 데이터(일별추이/구독/카테고리), 역할변경/차단/숨김/비즈니스지표 |
| `server/src/routes/adminRoutes.js` | 수정 | PATCH 라우트 (역할/차단/숨김), GET metrics |
| `client/src/api/apiClient.js` | 수정 | 커뮤니티 CRUD + 관리자 API 함수 16개 추가 |
| `client/src/pages/CommunityPage.jsx` | 수정 | 카테고리 탭, 페이지네이션, 인기글 사이드바, 카테고리 뱃지 |
| `client/src/pages/PostDetail.jsx` | 수정 | 좋아요 토글, 수정/삭제 버튼, 댓글 삭제 |
| `client/src/pages/PostWritePage.jsx` | **신규** | 카테고리 선택 + 제목/내용 입력 + 작성/수정 겸용 |
| `client/src/pages/AdminDashboard.jsx` | 수정 | 탭 UI, Recharts 3종 차트, 유저/게시물 관리 |
| `client/src/App.jsx` | 수정 | /community/write, /community/edit/:id 라우트 추가 |

## 4. 검증 결과

### API 테스트 (In-Memory Mock DB)
| 엔드포인트 | 방법 | 결과 |
|:---|:---:|:---|
| `GET /api/health` | GET | ✅ `status: "up"`, DB 모드: In-Memory |
| `POST /api/v1/auth/register` | POST | ✅ JWT 토큰 + 유저 정보 반환 |
| `POST /api/v1/auth/login` (admin) | POST | ✅ `role: "admin"` 확인 |
| `GET /api/v1/posts?category=tips` | GET | ✅ 6개 tips 게시글 필터링 + 페이지네이션 정보 |
| `POST /api/v1/posts/:id/like` | POST | ✅ `liked: true` 반환 |
| `POST /api/v1/posts` (카테고리 포함) | POST | ✅ `category: "tips"` 게시글 생성 |
| `GET /api/v1/admin/stats` | GET | ✅ 31명 유저, 15개 게시글, 57개 최적화 프로필, 구독 분포, 일별 추이 |
| `PATCH /api/v1/admin/users/:id/role` | PATCH | ✅ `admin로 변경되었습니다` |
| `PATCH /api/v1/admin/users/:id/ban` | PATCH | ✅ `유저가 차단되었습니다` |
| `PATCH /api/v1/admin/posts/:id/hide` | PATCH | ✅ `게시글이 숨겨졌습니다` |

### 서버 기동 확인
- `node --check server/server.js`: ✅ 문법 오류 없음
- `node server/server.js`: ✅ 정상 기동 (In-Memory Mock DB 모드)

## 5. 결과 및 의의
- 커뮤니티 기능이 단순 CRUD에서 **카테고리 분류, 좋아요 시스템, 인기글 추천, 페이지네이션** 등 실제 서비스 수준의 게시판 기능으로 확장되었습니다.
- 관리자 대시보드가 기본 통계에서 **Recharts 시각화 차트, 유저 역할 관리, 차단 기능, 게시글 숨김 관리** 등 운영 도구 수준으로 고도화되었습니다.
- 모든 신규 기능이 **PostgreSQL과 In-Memory Mock DB 양쪽에서 동일하게 동작**하도록 쿼리 파서를 확장하여, 로컬 개발과 Vercel 프로덕션 배포 모두 지원합니다.
- Vercel 기존 DB 테이블을 DROP 후 재배포하면 `initDb()`가 새 스키마로 자동 생성되므로, 별도 마이그레이션 없이 프로덕션 적용이 가능합니다.
