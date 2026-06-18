# Phase 5: UX 고도화 및 유저 편의 기능 추가
*SYNCRIG 플랫폼 — 15주차 추가 검증 및 개선 산출물*

> **목적:** 15주차 1차 검증(Phase 1~4) 이후 제기된 UX의 개선 요구사항(게임 라이브러리 검증, 어드민 패널 상태 보존, 스마트 네비게이션)을 보완하고, 사용자 활동 관리 및 편의성 극대화를 위한 **마이페이지(My Page)**를 신설하여 플랫폼 완성도를 높입니다.

---

## 1. 주요 개선 및 추가 기능 상세

### 1.1. 최적화 허브 게임 라이브러리 검증 및 게임 선택 고도화
- **미연동 온보딩 가이드**: Steam/Riot 계정 연동 정보가 없는 경우, 무분별하게 추천 엔진 연산이 실행되는 것을 방지하기 위해 "연동된 게임 라이브러리가 없습니다" 안내 카드와 대시보드 바로가기 링크를 제공합니다.
- **게임 선택 드롭다운**: 연동된 게임 라이브러리가 있을 경우, 상단 드롭다운 메뉴에서 게임을 선택하여 `game_id` 기반 맞춤 AI 성능 추천을 정밀 조회할 수 있도록 개선했습니다.
- **백엔드 매칭 필터 및 복합 캐싱**: 백엔드 API에서 `game_id`가 UUID 또는 `external_app_id`일 때 모두 필터링을 지원하도록 고도화하고, 2.5초 연산 지연 생략 캐시 조건을 `[동일 스펙 + 동일 게임]`으로 변경했습니다.

### 1.2. 어드민 패널 및 스마트 뒤로가기 UX 개선
- **SessionStorage 기반 상태 보존**: 어드민 패널(`AdminDashboard.jsx`)에서 특정 게시물 관리 도중 상세 페이지로 이동했다가 복귀 시, 활성 탭(`activeTab`) 및 검색어 입력값(`searchQuery`, `postSearchQuery`)이 그대로 보존되어 재입력/재선택의 번거로움을 완전히 제거했습니다.
- **스마트 히스토리 백**: 글 상세 페이지(`PostDetail.jsx`)에서 목록 복귀 시, 단순 정적 라우팅이 아닌 `window.history` 존재 여부에 따라 `navigate(-1)`을 동적 호출하여 직전의 검색 상태와 탭이 보존된 상태로 자연스럽게 되돌아갑니다.

### 1.3. 마이페이지(My Page) 신설 및 설정 화면 분리
- **마이페이지 통합 뷰 (`MyPage.jsx` [신설])**:
  - **프로필 정보**: 계정 메일, 소셜 연동 뱃지 현황을 일목요연하게 표시합니다.
  - **닉네임 변경 폼**: 기존 설정 탭에 파편화되어 있던 닉네임 변경 기능을 프로필 관리와 통합하여 갱신 즉시 사이드바 및 레이아웃 전체에 자동 동기화되도록 연동했습니다.
  - **구독 정보**: Free 요금제 등급 사용 시 PRO 등급 업그레이드를 장려하는 화려한 카드 배너를 노출하고, 결제 화면(`/subscription`)으로 연동합니다. PRO 구독자의 경우 👑 PRO 멤버십 활성화 상태 뱃지를 보여줍니다.
  - **활동 집계 요약 카드**: 작성 글 수, 작성 댓글 수, 등록한 PC 사양 수, 연동 게임 수 등의 활동 카운트를 요약해 제공합니다.
  - **작성 기록 탭 테이블**: "내가 작성한 게시글" 및 "내가 작성한 댓글"을 탭 토글 형태로 보여주며, 각 행 클릭 시 해당 글 상세 페이지(`/community/:id`)로 즉각 내비게이션됩니다. 댓글 탭에는 해당 댓글이 달린 **원글 제목(`post_title`)** 컬럼도 포함해 직관성을 높였습니다.
- **설정(Settings) 화면 단순화**: 닉네임 변경 기능이 마이페이지로 이전됨에 따라, `SettingsView.jsx`에서는 테마(다크/라이트) 변경 및 언어 설정 영역만 직관적으로 남겨 단순화했습니다.

### 1.4. 시스템 안정성 및 UUID 예외 가드 추가
- **PostgreSQL UUID 캐스팅 에러 방지**: 소셜 로그인 mock 토큰 복구 시 임시 ID(`'user-mock-id'`)와 같은 비표준 UUID 문자열이 전달될 경우, 백엔드가 PostgreSQL DB에 쿼리를 전송하는 단계에서 500 구문 에러(`invalid input syntax for type uuid`)가 발생하는 문제를 해결했습니다.
- **정규식 가드**: `authController.js`에 UUID 포맷 검증 헬퍼를 추가하여 유효하지 않은 UUID 문자열 유입 시 즉시 안전하게 빈 배열(`[]`)로 정상 응답하도록 예외 가드를 설계했습니다.

---

## 2. API 및 라우트 갱신 현황 (Phase 5)

### 2.1. 신규 백엔드 API
| 메서드 | 엔드포인트 | 역할 | 인증 가드 |
|:---|:---|:---|:---:|
| `GET` | `/api/v1/users/me/posts` | 로그인한 유저 본인이 작성한 커뮤니티 게시글 목록 조회 | JWT 인증 (`authenticateToken`) |
| `GET` | `/api/v1/users/me/comments` | 로그인한 유저 본인이 작성한 댓글 목록 조회 | JWT 인증 (`authenticateToken`) |

### 2.2. 신규 프론트엔드 라우트
| 경로 | 컴포넌트 | 역할 |
|:---|:---|:---|
| `/mypage` | `MyPage.jsx` | 프로필 갱신, 요금제 관리, 유저 활동 목록 및 통계 집계 대시보드 뷰 |

---

## 3. 관련 소스코드 파일 변경 목록

### 3.1. 백엔드 (Server API)
- [MODIFY] [`db.js`](file:///c:/Users/dlrjs/Desktop/webserviceplatform/webplatform_w10/server/src/config/db.js): Mock DB 쿼리 파서에 유저별 작성 글 및 댓글 필터링(`user_id = $1`) 지원 추가.
- [MODIFY] [`authController.js`](file:///c:/Users/dlrjs/Desktop/webserviceplatform/webplatform_w10/server/src/controllers/authController.js): `getUserPosts`, `getUserComments` 컨트롤러 함수 및 UUID 정규식 검증 가드 탑재.
- [MODIFY] [`userRoutes.js`](file:///c:/Users/dlrjs/Desktop/webserviceplatform/webplatform_w10/server/src/routes/userRoutes.js): 유저 글/댓글 조회 엔드포인트 마운트.

### 3.2. 프론트엔드 (Client Application)
- [MODIFY] [`apiClient.js`](file:///c:/Users/dlrjs/Desktop/webserviceplatform/webplatform_w10/client/src/api/apiClient.js): 프론트엔드 API 통신 헬퍼 추가.
- [MODIFY] [`useSEO.js`](file:///c:/Users/dlrjs/Desktop/webserviceplatform/webplatform_w10/client/src/hooks/useSEO.js): 마이페이지 전용 메타데이터 추가.
- [MODIFY] [`App.jsx`](file:///c:/Users/dlrjs/Desktop/webserviceplatform/webplatform_w10/client/src/App.jsx): `/mypage` 경로 라우팅 등록.
- [MODIFY] [`MainLayout.jsx`](file:///c:/Users/dlrjs/Desktop/webserviceplatform/webplatform_w10/client/src/components/layout/MainLayout.jsx): 사이드바 NAV 메뉴에 마이페이지 추가 및 하단 프로필 영역 NavLink 래핑.
- [MODIFY] [`SettingsView.jsx`](file:///c:/Users/dlrjs/Desktop/webserviceplatform/webplatform_w10/client/src/features/settings/SettingsView.jsx) / [`SettingsPage.jsx`](file:///c:/Users/dlrjs/Desktop/webserviceplatform/webplatform_w10/client/src/pages/SettingsPage.jsx): 닉네임 변경 폼 및 핸들러 소스코드 일체 분리/제거.
- [NEW] [`MyPage.jsx`](file:///c:/Users/dlrjs/Desktop/webserviceplatform/webplatform_w10/client/src/pages/MyPage.jsx): 통합 마이페이지 전용 컴포넌트 신설.
