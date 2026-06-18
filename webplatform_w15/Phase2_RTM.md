# Phase 2: 양방향 요구사항 추적 매트릭스 (RTM)
*SYNCRIG 플랫폼 — 15주차 검증 산출물*

> **목적:** 초기 설계 명세(W4 PRD/FSD, W6 Architecture)와 현재 구현체를 단일 테이블로 매핑합니다.

---

## 1. 요구사항 추적 매트릭스 (RTM)

### 1.1. 핵심 기능 요구사항

| 요구사항 ID | 대분류 | 상세 요구사항 정의 | 출처 (Source) | 매핑된 ERD 테이블 | 실제 코드 경로 / API | 구현 상태 | 검증 방법 |
|:---|:---|:---|:---|:---|:---|:---|:---|
| **REQ-001** | 회원관리 | 사용자는 이메일+비밀번호로 회원가입 및 로그인이 가능해야 한다 | SRS §2.2, FSD §3.1 | `users` | `authController.js` → `POST /register`, `POST /login` | ✅ **완료** | 수동 테스트 완료 |
| **REQ-002** | 회원관리 | OAuth 2.0 기반 소셜 로그인(Steam, Riot)이 가능해야 한다 | SRS §2.2.1, FSD §3.1 | `users` | `passport.js` + `authRoutes.js` → `GET /steam`, `GET /riot` | ✅ **완료** | Passport.js + Fallback 구현 |
| **REQ-003** | 회원관리 | JWT 기반 이중 토큰(Access+Refresh) 인증 체계를 갖춰야 한다 | SRS §4.2 | `users` | `authController.js` → `generateTokenPair()`, `POST /refresh` | ✅ **완료** | 토큰 발급·갱신 동작 확인 |
| **REQ-004** | 회원관리 | 이메일 인증 코드 발송/검증이 가능해야 한다 | 추가 기능 | `email_verification_codes` | `authController.js` → `POST /send-code`, `POST /verify-code` | ⚠️ **부분** | Mock(콘솔 출력)만 구현, 실제 SMTP 미연동 |
| **REQ-005** | 하드웨어 | 사용자가 하드웨어 제원(CPU, GPU, RAM, 해상도, 주사율)을 등록·관리(CRUD)할 수 있어야 한다 | SRS §2.2.2, FSD §3.2 | `hardware_profiles` | `profileController.js` → `GET/POST/PATCH/DELETE /hardware-profiles` | ✅ **완료** | express-validator 유효성 검증 포함 |
| **REQ-006** | 하드웨어 | 기본(Default) 하드웨어 프로필을 지정할 수 있어야 한다 | FSD §1.3.1.1 | `hardware_profiles.is_default` | `profileController.js` → `PATCH /:id/default` | ✅ **완료** | 트랜잭션 기반 처리 |
| **REQ-007** | 매칭 | 가중치 기반 유사도 알고리즘(GPU 50%, CPU 30%, RAM 10%, 해상도 10%)으로 최적 세팅을 매칭해야 한다 | SRS §2.2.3, FSD §3.3 | `optimization_profiles`, `hardware_profiles` | `matchingEngine.js` → `GET /profiles/recommendations` | ⚠️ **부분** | 가중치 배분 변경(원 명세: GPU 50/해상도 30/CPU 10/RAM 10 → 구현: GPU 50/CPU 30/RAM 10/해상도 10), Threshold 0.9→0.8 |
| **REQ-008** | 매칭 | 유사도 90% 이상 매칭 결과만 필터링하여 출력해야 한다 | SRS §2.2.3, FSD §3.3 | `optimization_profiles` | `matchingEngine.js` → `threshold` param | ⚠️ **부분** | 기본 threshold를 0.8로 완화 (명세는 0.9) |
| **REQ-009** | 매칭 | 시스템 병목(Bottleneck)을 분석하여 경고해야 한다 | FSD §3.3 | - | `detectBottleneck.js` → `GET /recommendations/ads` | ✅ **완료** | CPU vs GPU 점수 비교 로직 구현 |
| **REQ-010** | 대시보드 | 게임 플레이 시간 및 업적 데이터를 Recharts 차트로 시각화해야 한다 | SRS §2.2.4, FSD §3.4 | - (외부 API 데이터) | `DashboardCharts.jsx` + `gameController.js` | ✅ **완료** | Pie/Bar/Gauge 차트 구현 |
| **REQ-011** | 대시보드 | Steam/Riot 게임 라이브러리를 동기화하여 표시해야 한다 | SRS §2.2.1 | `games` | `steamService.js` + `gameController.js` → `GET /games/library` | ✅ **완료** | Steam Web API + Fallback Mock |
| **REQ-012** | 관리 | 관리자가 유저 목록 조회, 역할 변경, 차단/해제가 가능해야 한다 | SRS §2.3 | `users` | `adminController.js` → `GET /users`, `PATCH /users/:id/role`, `PATCH /users/:id/ban` | ✅ **완료** | isAdmin 미들웨어 보호 |
| **REQ-013** | 관리 | 관리자가 트래픽 통계, 가입자 추이, 구독 분포를 조회할 수 있어야 한다 | SRS §2.3 | `users`, `posts` | `adminController.js` → `GET /stats`, `GET /metrics` | ✅ **완료** | 14일/30일 추이 차트 데이터 |

### 1.2. 초과 구현된 기능 (Over-spec)

| 요구사항 ID | 대분류 | 상세 기능 설명 | 출처 | 매핑된 ERD 테이블 | 실제 코드 경로 | 구현 상태 | 비고 |
|:---|:---|:---|:---|:---|:---|:---|:---|
| **OVR-001** | 커뮤니티 | 커뮤니티 게시판 CRUD + 좋아요 + 댓글 시스템 | 개발 중 추가 | `posts`, `comments`, `post_likes` | `postController.js` + `CommunityPage.jsx` | ✅ **완료** | 초기 명세에 없음 → 역방향 반영 필요 |
| **OVR-002** | 결제 | 토스페이먼츠 기반 프리미엄 구독 결제 시스템 | 개발 중 추가 (SRS §6.1 비즈니스 모델) | `users.subscription_status`, `users.toss_payment_key` | `paymentController.js` + `SubscriptionPage.jsx` | ✅ **완료** | PRD Monetization 기반 확장 |
| **OVR-003** | 프리미엄 | 프리미엄 전용 상위 1% 통계 위젯 | 개발 중 추가 | - (Mock 데이터) | `statsController.js` + `PremiumStatsWidget.jsx` | ⚠️ **부분** | Mock 데이터만, 실제 통계 집계 미구현 |
| **OVR-004** | 광고 | 하드웨어 병목 기반 타겟 업그레이드 광고 위젯 | SRS §6.1 | - | `detectBottleneck.js` + `UpgradeRecommendationWidget.jsx` | ✅ **완료** | PRD 수익모델 기반 |
| **OVR-005** | UX | 다크/라이트 이중 테마 시스템 | 개발 중 추가 | - | CSS Custom Properties | ✅ **완료** | - |
| **OVR-006** | UX | 실시간 검색 + 알림 시스템 | 개발 중 추가 | - | `useSearch.js` + `NotificationDropdown.jsx` + `useNotificationStore.js` | ✅ **완료** | 클라이언트사이드 구현 |
| **OVR-007** | 보안 | In-Memory Fallback 데이터베이스 시스템 | 개발 중 추가 | - | `mockDb.js` + `db.js` | ✅ **완료** | PostgreSQL 미연결 시 자동 전환 |
| **OVR-008** | SEO | WCAG 2.1 웹접근성 + SEO(OG/Twitter/JSON-LD) | 개발 중 추가 | - | `index.html` + `useSEO.js` | ✅ **완료** | 시맨틱 HTML, ARIA 속성, 구조화 데이터 |
| **OVR-009** | 보안 | 소셜 로그인 Fallback (API Key 미설정 시 우회) | 개발 중 추가 | - | `authRoutes.js` (checkSteamAuth, checkRiotAuth) | ✅ **완료** | Vercel 배포 대응 |
| **OVR-010** | 계정 | 외부 계정 연동(Link) / 해제(Unlink) 기능 | 개발 중 추가 | `users.linked_providers` | `authController.js` → `DELETE /unlink/:provider` | ✅ **완료** | 세션 기반 연동 모드 |
| **OVR-011** | 관리 | 관리자 게시글 숨기기/삭제, 댓글 삭제 | 개발 중 추가 | `posts.is_hidden` | `adminController.js` | ✅ **완료** | - |

---

## 2. 비기능 요구사항 (NFR) 추적

| NFR ID | 카테고리 | 요구사항 | 출처 | 실제 구현 상태 | 비고 |
|:---|:---|:---|:---|:---|:---|
| **NFR-001** | 보안 | OAuth 2.0 인증 준수 | SRS §4.2, FSD §5 | ✅ **완료** | Passport.js (OpenID/OAuth2) |
| **NFR-002** | 보안 | AES-256 암호화 저장 | SRS §4.2, FSD §5 | ❌ **미구현** | 비밀번호는 PBKDF2(SHA-512) 해싱, 외부 토큰 AES-256 암호화는 미구현 |
| **NFR-003** | 보안 | CSRF/XSS 방어 | FSD §5 | ⚠️ **부분** | Helmet 적용 (XSS 헤더), CSRF 토큰은 미구현 |
| **NFR-004** | 성능 | Redis 캐싱 (100ms 이내 응답) | SRS §4.1, FSD §5 | ❌ **미구현** | Redis 미도입, DB 직접 쿼리 |
| **NFR-005** | 성능 | 비동기 처리 | SRS §4.1 | ✅ **완료** | async/await 전면 적용 |
| **NFR-006** | 확장성 | Docker/Kubernetes 기반 배포 | Architecture §2.6 | ❌ **미구현** | Vercel Serverless Functions 사용 (대안 채택) |
| **NFR-007** | UI | 반응형 레이아웃 (모바일 360px 대응) | SRS §3.1, FSD §5 | ✅ **완료** | TailwindCSS 반응형 유틸리티 |
| **NFR-008** | UI | WCAG 2.1 웹접근성 | FSD §5 | ✅ **완료** | 시맨틱 HTML, ARIA, sr-only |
| **NFR-009** | 유지보수 | Winston+Morgan 로깅 | SRS §4.4, FSD §5 | ✅ **완료** | Trace ID 기반 요청 추적 로깅 |
| **NFR-010** | 보안 | JWT Secret 환경변수 관리 | 개발 프로세스 | ✅ **완료** | Fallback 경고 + 프로덕션 가드 |
| **NFR-011** | 보안 | Rate Limiting | 개발 프로세스 | ✅ **완료** | express-rate-limit (인증 API) |

---

## 3. 설계 문서 ↔ 구현 매핑 요약

### 3.1. ERD 테이블 대조

| 설계 ERD (W6) | 현재 구현 | 상태 |
|:---|:---|:---|
| `users` | `users` (확장됨: email, nickname, password_hash, role, is_banned, linked_providers, subscription_status, toss_payment_key 추가) | ✅ 존재 + 확장 |
| `hardware_profiles` | `hardware_profiles` | ✅ 일치 |
| `games` | `games` | ✅ 일치 |
| `game_libraries` | ❌ **미구현** | ❌ 누락 |
| `optimization_profiles` | `optimization_profiles` (one_percent_low_fps, game_version, likes 추가) | ✅ 존재 + 확장 |
| *(미설계)* | `email_verification_codes` | 🆕 초과 추가 |
| *(미설계)* | `posts` | 🆕 초과 추가 |
| *(미설계)* | `comments` | 🆕 초과 추가 |
| *(미설계)* | `post_likes` | 🆕 초과 추가 |

### 3.2. API Endpoint 대조

| 설계 API (W6) | 현재 구현 | 상태 |
|:---|:---|:---|
| `GET /api/v1/auth/{provider}/callback` | `GET /api/v1/auth/steam/callback`, `/riot/callback` | ✅ 일치 |
| `POST /api/v1/users/hardware-profiles` | `POST /api/v1/users/hardware-profiles` | ✅ 일치 |
| `GET /api/v1/profiles/recommendations` | `GET /api/v1/profiles/recommendations` | ✅ 일치 |
| *(미설계)* | 24개 추가 API 엔드포인트 | 🆕 초과 추가 |

---

*Phase 2 RTM 구성 완료. 13개 핵심 요구사항 중 10개 완료, 3개 부분 구현. 11개 초과 기능 식별.*
