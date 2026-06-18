# Phase 1: 기능 인벤토리 구축 (Feature Audit)
*SYNCRIG 플랫폼 — 15주차 검증 산출물*

> **목적:** 현재 동작하는 웹 애플리케이션의 실제 상태를 전수 조사하여 파악합니다.

---

## 1. 프론트엔드 라우트 및 UI 컴포넌트 전수 목록

### 1.1. 비로그인 상태 (Public Routes)

| # | URL 경로 | 페이지 컴포넌트 | 주요 기능 설명 |
|:-:|:---|:---|:---|
| 1 | `/` | `LandingPage.jsx` | 서비스 소개 랜딩 페이지 (CTA → 로그인 유도) |
| 2 | `/login` | `AuthPage.jsx` | 이메일/비밀번호 로그인 + 회원가입 + 이메일 인증 코드 |
| 3 | `/auth/callback` | `AuthCallback.jsx` | OAuth 소셜 로그인 콜백 처리 (토큰 파싱 → 상태 저장) |
| 4 | `/payment-success` | `PaymentSuccess.jsx` | 결제 완료 페이지 |
| 5 | `/payment-fail` | `PaymentFail.jsx` | 결제 실패 페이지 |
| - | `*` (기타) | → `Navigate to="/"` | 미등록 경로는 랜딩페이지로 리다이렉트 |

### 1.2. 로그인 상태 (Protected Routes — `MainLayout` 래핑)

| # | URL 경로 | 페이지 컴포넌트 | 주요 기능 설명 |
|:-:|:---|:---|:---|
| 6 | `/dashboard` | `DashboardPage.jsx` | 통합 대시보드 (게임 라이브러리 차트, 계정 연동 상태, 업그레이드 광고 위젯, 프리미엄 통계) |
| 7 | `/hardware` | `HardwarePage.jsx` | 하드웨어 프로필 CRUD (CPU/GPU/RAM/해상도/주사율) |
| 8 | `/recommend` | `RecommendPage.jsx` | 매칭 알고리즘 결과 조회 (유사도 기반 최적화 세팅 추천 리스트) |
| 9 | `/community` | `CommunityPage.jsx` | 커뮤니티 게시판 목록 (카테고리 필터, 페이지네이션) |
| 10 | `/community/:id` | `PostDetail.jsx` | 게시글 상세 (댓글, 좋아요 토글, 조회수) |
| 11 | `/community/write` | `PostWritePage.jsx` | 게시글 작성 |
| 12 | `/community/edit/:id` | `PostWritePage.jsx` | 게시글 수정 (동일 컴포넌트 재활용) |
| 13 | `/admin` | `AdminDashboard.jsx` | 관리자 대시보드 (유저 관리, 게시글 관리, 통계 차트, 비즈니스 지표) |
| 14 | `/settings` | `SettingsPage.jsx` | 환경 설정 (닉네임 변경 등) |
| 15 | `/subscription` | `SubscriptionPage.jsx` | 구독(결제) 페이지 (토스페이먼츠 연동) |
| 16 | `/payment-success` | `PaymentSuccess.jsx` | 결제 완료 (로그인 상태) |
| 17 | `/payment-fail` | `PaymentFail.jsx` | 결제 실패 (로그인 상태) |
| - | `*` (기타) | → `Navigate to="/dashboard"` | 미등록 경로는 대시보드로 리다이렉트 |

### 1.3. 주요 UI 컴포넌트 목록

| 카테고리 | 컴포넌트 | 파일 경로 |
|:---|:---|:---|
| **Layout** | `MainLayout` | `client/src/components/layout/MainLayout.jsx` |
| **Hardware** | `HardwareProfileForm` | `client/src/components/HardwareProfileForm.jsx` |
| **Recommendation** | `RecommendationList` | `client/src/components/RecommendationList.jsx` |
| **Notification** | `NotificationDropdown` | `client/src/components/NotificationDropdown.jsx` |
| **Dashboard** | `DashboardCharts` | `client/src/features/dashboard/DashboardCharts.jsx` |
| **Dashboard** | `PremiumStatsWidget` | `client/src/components/dashboard/PremiumStatsWidget.jsx` |
| **Ads** | `UpgradeRecommendationWidget` | `client/src/components/ads/UpgradeRecommendationWidget.jsx` |
| **Settings** | `SettingsView` | `client/src/features/settings/SettingsView.jsx` |
| **Payment** | (결제 관련 컴포넌트) | `client/src/components/payment/` |

### 1.4. 상태 관리 (Zustand Store)

| Store | 파일 경로 | 주요 상태 |
|:---|:---|:---|
| `useAuthStore` | `client/src/store/useAuthStore.js` | user, tokens, userSpec, gameLibrary, achievementsCount, syncAccount 등 |
| `useNotificationStore` | `client/src/store/useNotificationStore.js` | notifications, addNotification, clearNotifications 등 |

### 1.5. Custom Hooks

| Hook | 파일 경로 | 용도 |
|:---|:---|:---|
| `useSEO` | `client/src/hooks/useSEO.js` | 페이지별 동적 `<title>` 및 메타 태그 관리 |
| `useSearch` | `client/src/hooks/useSearch.js` | 클라이언트 사이드 실시간 검색 기능 |

---

## 2. 백엔드 API 엔드포인트 전수 목록

### 2.1. 인증 관련 (`/api/v1/auth`)

| # | Method | Endpoint | 인증 | 설명 | Rate Limit |
|:-:|:---:|:---|:---:|:---|:---:|
| 1 | POST | `/register` | N | 회원가입 (이메일 + 닉네임 + 비밀번호) | ✅ |
| 2 | POST | `/login` | N | 로그인 (JWT 토큰 쌍 발급) | ✅ |
| 3 | POST | `/refresh` | N | Access Token 자동 갱신 (Refresh Token 사용) | - |
| 4 | DELETE | `/unlink/:provider` | Y | 연동된 외부 계정(Steam/Riot) 해제 | ✅ |
| 5 | POST | `/send-code` | N | 이메일 인증 코드 발송 (Mock) | ✅ |
| 6 | POST | `/verify-code` | N | 이메일 인증 코드 검증 | ✅ |
| 7 | GET | `/steam` | N | Steam OAuth 시작 (Passport.js / Fallback) | ✅ |
| 8 | GET | `/steam/callback` | N | Steam OAuth 콜백 | ✅ |
| 9 | GET | `/riot` | N | Riot OAuth 시작 (Passport.js / Fallback) | ✅ |
| 10 | GET | `/riot/callback` | N | Riot OAuth 콜백 | ✅ |

### 2.2. 하드웨어 프로필 (`/api/v1/users/hardware-profiles`)

| # | Method | Endpoint | 인증 | 설명 |
|:-:|:---:|:---|:---:|:---|
| 11 | GET | `/` | Y | 내 하드웨어 프로필 전체 조회 |
| 12 | POST | `/` | Y | 하드웨어 프로필 등록 (유효성 검증 포함) |
| 13 | PATCH | `/:id/default` | Y | 기본 프로필 지정 변경 |
| 14 | DELETE | `/:id` | Y | 하드웨어 프로필 삭제 |

### 2.3. 추천 시스템 (`/api/v1/profiles/recommendations`)

| # | Method | Endpoint | 인증 | 설명 |
|:-:|:---:|:---|:---:|:---|
| 15 | GET | `/` | Y | 매칭 엔진 기반 최적화 세팅 추천 결과 |
| 16 | GET | `/ads` | Y | 하드웨어 병목 기반 업그레이드 광고 데이터 |

### 2.4. 게임 라이브러리 (`/api/v1/games`)

| # | Method | Endpoint | 인증 | 설명 |
|:-:|:---:|:---|:---:|:---|
| 17 | GET | `/library` | Y | Steam/Riot 게임 라이브러리 동기화 조회 |

### 2.5. 커뮤니티 게시판 (`/api/v1/posts`)

| # | Method | Endpoint | 인증 | 설명 |
|:-:|:---:|:---|:---:|:---|
| 18 | GET | `/` | N | 게시글 목록 (카테고리, 페이지네이션, 정렬) |
| 19 | GET | `/:id` | N | 게시글 상세 (댓글 포함, 조회수 +1) |
| 20 | POST | `/` | Y | 게시글 작성 |
| 21 | PUT | `/:id` | Y | 게시글 수정 (작성자/관리자만) |
| 22 | DELETE | `/:id` | Y | 게시글 삭제 (작성자/관리자만) |
| 23 | POST | `/:id/like` | Y | 좋아요 토글 |
| 24 | POST | `/:id/comments` | Y | 댓글 작성 |
| 25 | DELETE | `/comments/:commentId` | Y | 댓글 삭제 (작성자/관리자만) |

### 2.6. 결제 (`/api/v1/payments`)

| # | Method | Endpoint | 인증 | 설명 |
|:-:|:---:|:---|:---:|:---|
| 26 | POST | `/confirm` | Y | 토스페이먼츠 결제 승인 (Mock/실제 분기) |

### 2.7. 프리미엄 통계 (`/api/v1/stats`)

| # | Method | Endpoint | 인증 | 설명 |
|:-:|:---:|:---|:---:|:---|
| 27 | GET | `/top-tier` | Y + Premium | 상위 1% 하드웨어 벤치마크 통계 (프리미엄 전용) |

### 2.8. 관리자 (`/api/v1/admin`)

| # | Method | Endpoint | 인증 | 설명 |
|:-:|:---:|:---|:---:|:---|
| 28 | GET | `/stats` | Y + Admin | 관리자 대시보드 통계 |
| 29 | GET | `/users` | Y + Admin | 유저 목록 (검색/필터) |
| 30 | PATCH | `/users/:id/role` | Y + Admin | 유저 역할 변경 (user ↔ admin) |
| 31 | PATCH | `/users/:id/ban` | Y + Admin | 유저 차단/해제 |
| 32 | GET | `/metrics` | Y + Admin | 비즈니스 지표 (30일 추이) |
| 33 | PATCH | `/posts/:id/hide` | Y + Admin | 게시글 숨기기/해제 |
| 34 | DELETE | `/posts/:id` | Y + Admin | 게시글 강제 삭제 |
| 35 | DELETE | `/comments/:id` | Y + Admin | 댓글 강제 삭제 |

### 2.9. 시스템 (`server.js` 직접 등록)

| # | Method | Endpoint | 인증 | 설명 |
|:-:|:---:|:---|:---:|:---|
| 36 | GET | `/api/health` | N | 서버 헬스체크 (DB 모드 포함) |
| 37 | GET | `/api/admin/force-reset-db` | N | DB 전체 리셋 (위험) |

---

## 3. 데이터베이스 스키마 현황

### 3.1. PostgreSQL 테이블 구조 (8개 테이블)

| # | 테이블명 | 주요 컬럼 | 관계 |
|:-:|:---|:---|:---|
| 1 | **`users`** | id(PK), email, nickname, provider, provider_id, password_hash, email_verified, role, is_banned, linked_providers(JSONB), subscription_status, toss_payment_key, created_at | UNIQUE(provider, provider_id) |
| 2 | **`email_verification_codes`** | id(PK), email, code, expires_at, used | - |
| 3 | **`hardware_profiles`** | id(PK), user_id(FK→users), is_default, cpu_model, gpu_model, ram_gb, resolution, refresh_rate, created_at | 1:N (users → hardware_profiles) |
| 4 | **`games`** | id(PK), external_app_id(UNIQUE), title, created_at | - |
| 5 | **`optimization_profiles`** | id(PK), user_id(FK→users), game_id(FK→games), hardware_id(FK→hardware_profiles), settings_json(JSONB), avg_fps, one_percent_low_fps, game_version, likes, created_at | N:1 (→ users, games, hardware_profiles) |
| 6 | **`posts`** | id(PK), user_id(FK→users), category, title, content, views, likes, is_pinned, is_hidden, created_at, updated_at | 1:N (users → posts) |
| 7 | **`comments`** | id(PK), post_id(FK→posts), user_id(FK→users), content, is_hidden, created_at | N:1 (→ posts, users) |
| 8 | **`post_likes`** | id(PK), post_id(FK→posts), user_id(FK→users), created_at | UNIQUE(post_id, user_id) |

### 3.2. 인덱스

| 인덱스명 | 대상 테이블 | 컬럼 |
|:---|:---|:---|
| `idx_hardware_gpu` | hardware_profiles | gpu_model |
| `idx_optimization_game` | optimization_profiles | game_id |
| `idx_posts_category` | posts | category |
| `idx_post_likes_post` | post_likes | post_id |

### 3.3. In-Memory Fallback (Mock DB)

PostgreSQL 미연결 시 `mockDb.js` 기반의 인메모리 DB로 자동 전환. `db.js` 내에 SQL 쿼리를 파싱하여 MOCK_DB 배열을 조작하는 700줄 규모의 쿼리 라우터가 구현되어 있음.

---

## 4. 미들웨어 및 보안 체계

| 구분 | 모듈 | 설명 |
|:---|:---|:---|
| **인증** | `authenticateToken` | JWT Bearer Token 검증 → `req.user` 주입 |
| **권한** | `isAdmin` | `req.user.role === 'admin'` 체크 |
| **권한** | `requirePremium` | `req.user.subscription_status === 'premium'` 체크 |
| **보안** | `helmet` | HTTP 보안 헤더 자동 설정 |
| **로깅** | `morgan` + `winston` | Trace ID 기반 요청 로깅 |
| **에러** | `errorHandler` | 글로벌 에러 핸들러 (에러 로깅 + 클라이언트 응답) |
| **Rate Limit** | `express-rate-limit` | 인증 API 15분/10회 제한 |
| **세션** | `express-session` | Passport.js OAuth 플로우용 세션 |

---

## 5. 핵심 비즈니스 로직

### 5.1. 매칭 엔진 (`matchingEngine.js`)
- **알고리즘**: 가중치 기반 정규화 L1-노름 (Weighted Normalized Manhattan Distance)
- **가중치**: GPU(50%) + CPU(30%) + RAM(10%) + 해상도(10%)
- **매칭 기준**: 유사도 ≥ 0.8 (Threshold, 기본값) → 내림차순 정렬
- **GPU/CPU 점수 테이블**: 내장 Tier 매핑 (GPU 18개, CPU 17개 모델 등록)

### 5.2. 병목 분석 (`detectBottleneck.js`)
- CPU vs GPU 성능 점수 비교 → 차이 40 이상 시 병목 컴포넌트 경고

### 5.3. Steam API 연동 (`steamService.js`)
- `IPlayerService/GetOwnedGames` API 호출
- API Key 미설정 시 Mock 데이터 Fallback (5개 게임)

---

*Phase 1 Feature Audit 완료. 총 14개 페이지, 37개 API 엔드포인트, 8개 DB 테이블이 현재 동작 중입니다.*
