# Phase 6: 페이지네이션 오류 해결, 정렬 및 게시글 고정 기능 구현
*SYNCRIG 플랫폼 — 15주차 추가 검증 및 개선 산출물*

> **목적:** 커뮤니티 데이터의 원활한 조회 및 탐색 환경을 위해 전체 페이지네이션 구조를 개편하고, 사용자 및 관리자 편의성을 위해 보기 개수 선택 드롭다운, 복수 기준 정렬 필터링, 그리고 관리자용 게시물 상단 고정(Pinning) 기능을 전격적으로 추가하였습니다.

---

## 1. 주요 개선 및 추가 기능 상세

### 1.1. 페이지네이션(Pagination) 및 보기 개수 조절 기능 도입
- **페이지수 계산 버그 해결**: PostgreSQL 데이터베이스 연동 시 `posts` 목록 조회에서 전체 글 개수(`COUNT(*)`) 쿼리가 누락되어 결과의 총 페이지수가 상시 10개 단위로만 처리되던 버그를 정밀 수정했습니다.
- **보기 개수 드롭다운 (Limit Select)**:
  - 커뮤니티 목록, 마이페이지(작성한 글/댓글), 관리자 패널(회원 관리/게시글 관리) 탭 상단에 **10개, 20개, 30개, 40개, 50개씩 보기** 선택 셀렉터를 장착했습니다.
  - 기본 노출 개수를 기존 10개에서 **20개**로 조율하여 첫 진입 시 더 많은 데이터를 한눈에 볼 수 있도록 시인성을 개선했습니다.
- **하단 네비게이션**: 전체 데이터 수와 Limit 값에 맞춰 페이지 버튼 번호와 이전/다음 아이콘 버튼이 연동되는 페이지네이션 하단 바를 배치했습니다.

### 1.2. 다각화된 글로벌 정렬(Sorting)
- **정렬 옵션 탑재**: 최신순, 오래된순, 인기순(추천 높은 순), 조회수순, 가나다순(제목순)으로 리스트를 정렬할 수 있는 드롭다운 기준 필터를 추가했습니다.
- **Mock DB 정렬 일관성**: local Mock DB 시뮬레이터(`db.js`)에서 페이징 슬라이싱(`slice`)을 수행하기 전, SQL 명세에 들어오는 `ORDER BY`의 다양한 구문을 감지해 인메모리 상에서 정렬과 고정을 글로벌하게 먼저 정렬하도록 개선하여 PostgreSQL 프로덕션 환경과 동일한 렌더링 무결성을 실현했습니다.

### 1.3. 관리자용 게시물 상단 고정(Pinning) 기능 구축
- **상단 고정 API (`PATCH /api/v1/posts/:id/pin`)**: 관리자 계정(`isAdmin`) 검증 가드를 탑재한 핀 토글 엔드포인트를 개설하고, `posts` 테이블의 `is_pinned` 값을 반전시키는 DB 쿼리를 수행합니다.
- **관리자 전용 제어 UI**:
  - 관리자로 로그인 시 게시글 상세 화면의 우측 수정/삭제 버튼 옆에 "상단 고정 / 고정 해제" 제어 토글이 노출됩니다.
  - 관리자 패널의 게시물 관리 리스트 내부에도 테이블 행 내에서 즉시 고정할 수 있는 인터랙티브 핀 버튼을 구현했습니다.
- **시각적 하이라이트**: 상단 고정 글은 정렬 기준과 무관하게 목록의 최상단에 배치되며, `border-l-4 border-l-yellow-500` 장식과 연한 골드빛 틴트 배경이 덧씌워진 시각 템플릿으로 렌더링됩니다.

---

## 2. API 및 라우트 갱신 현황 (Phase 6)

### 2.1. 신규/수정 백엔드 API
| 메서드 | 엔드포인트 | 역할 | 인증 가드 |
|:---|:---|:---|:---:|
| `PATCH` | `/api/v1/posts/:id/pin` | 특정 게시글의 상단 고정 여부(`is_pinned`) 토글 | JWT 인증 및 관리자 가드 (`authenticateToken`, `isAdmin`) |
| `GET` | `/api/v1/posts` | `limit`, `page`, `sort`, `category` 연동 전체 게시물 페이징/정렬 조회 | 없음 |
| `GET` | `/api/v1/admin/users` | `limit`, `page`, `sort`, `search`, `filter` 연동 회원 페이징/정렬 조회 | JWT 인증 및 관리자 가드 (`authenticateToken`, `isAdmin`) |
| `GET` | `/api/v1/admin/posts` | `limit`, `page`, `sort`, `search`, `filter` 연동 게시글 페이징/정렬 조회 | JWT 인증 및 관리자 가드 (`authenticateToken`, `isAdmin`) |

---

## 3. 관련 소스코드 파일 변경 목록

### 3.1. 백엔드 (Server API)
- [MODIFY] [`db.js`](file:///c:/Users/dlrjs/Desktop/webserviceplatform/webplatform_w10/server/src/config/db.js): Mock DB 쿼리 파서에 전체 posts 개수 연산 및 `user_id = $` 엄격 식별자 파싱, 글로벌 정렬/고정 우선 적용 기능 추가.
- [MODIFY] [`postRoutes.js`](file:///c:/Users/dlrjs/Desktop/webserviceplatform/webplatform_w10/server/src/routes/postRoutes.js): `/api/v1/posts/:id/pin` 관리자 라우트 신규 등록.
- [MODIFY] [`postController.js`](file:///c:/Users/dlrjs/Desktop/webserviceplatform/webplatform_w10/server/src/controllers/postController.js): `getPosts` 내 `totalCount` 계산용 COUNT 쿼리 추가 및 정렬 SQL 바인딩, `togglePinPost` 컨트롤러 신설.
- [MODIFY] [`adminController.js`](file:///c:/Users/dlrjs/Desktop/webserviceplatform/webplatform_w10/server/src/controllers/adminController.js): `getUsers` 및 `getAdminPosts`를 dynamic 정렬 및 pagination이 반영된 서버 사이드 페이징 API로 고도화.
- [MODIFY] [`authController.js`](file:///c:/Users/dlrjs/Desktop/webserviceplatform/webplatform_w10/server/src/controllers/authController.js): 마이페이지용 `getUserPosts`, `getUserComments`에 page, limit, sort 파라미터를 추가 반영.

### 3.2. 프론트엔드 (Client Application)
- [MODIFY] [`apiClient.js`](file:///c:/Users/dlrjs/Desktop/webserviceplatform/webplatform_w10/client/src/api/apiClient.js): 목록 조회 API들에 `limit`, `sort`, `page` 파라미터를 수용하고, `togglePostPin` API 핸들러 추가.
- [MODIFY] [`CommunityPage.jsx`](file:///c:/Users/dlrjs/Desktop/webserviceplatform/webplatform_w10/client/src/pages/CommunityPage.jsx): 카테고리 필터 개선, 보기 개수 및 정렬 셀렉터 컴포넌트 추가, Pinned 포스트 하이라이트 스타일 구현.
- [MODIFY] [`PostDetail.jsx`](file:///c:/Users/dlrjs/Desktop/webserviceplatform/webplatform_w10/client/src/pages/PostDetail.jsx): 관리자 로그인 조건 충족 시 상단 고정 토글 버튼 표기 및 디스패치 연동.
- [MODIFY] [`AdminDashboard.jsx`](file:///c:/Users/dlrjs/Desktop/webserviceplatform/webplatform_w10/client/src/pages/AdminDashboard.jsx): 회원 및 게시물 테이블 아래 페이지네이션 컨트롤러를 적용하고 정렬 및 보기 개수 셀렉터 탑재, 게시글 행에 핀 버튼 장착.
- [MODIFY] [`MyPage.jsx`](file:///c:/Users/dlrjs/Desktop/webserviceplatform/webplatform_w10/client/src/pages/MyPage.jsx): 작성한 글과 댓글 리스트에 각각 보기 개수, 정렬 옵션, 하단 페이지 이동 버튼을 결합하고 JSX 구문 에러 정밀 보완.
