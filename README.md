# 🚀 SYNCRIG: Hardware Profile Optimization Platform

![Vercel](https://img.shields.io/badge/Deployed-Vercel-black?style=flat-square&logo=vercel)
![React](https://img.shields.io/badge/Frontend-React%20%2B%20Vite-61DAFB?style=flat-square&logo=react)
![Express](https://img.shields.io/badge/Backend-Node.js%20%2B%20Express-339933?style=flat-square&logo=node.js)

**SYNCRIG**은 사용자의 PC 하드웨어 사양(CPU, GPU, RAM 등)을 분석하여, 데이터베이스에 축적된 전 세계 게이머들의 최적화 설정 프로필과 비교하고 **가장 적합한 인게임 그래픽 세팅을 추천해 주는 웹 플랫폼**입니다.

이 레포지토리는 기획부터 디자인, 알고리즘 구현, 풀스택 연동, Vercel 상용 배포, 웹접근성(WCAG 2.1) 및 SEO 최적화, 그리고 커뮤니티 고도화 및 기획-코드 정합성 검증까지 이어지는 **15주간의 소프트웨어 생명주기(SDLC)** 산출물을 모두 담고 있습니다.

---

## 🌟 주요 기능 (Key Features)

### 🧮 하드웨어 매칭 엔진 (Matching Engine v1.0)
- 가중치가 부여된 정규화 L1-노름(Weighted Normalized Manhattan Distance) 기반 알고리즘 탑재
- GPU(50%), CPU(30%), RAM(10%), 해상도(10%) 가중치 기반 유사도(Similarity) 산출 및 랭킹 시스템
- 게임별(`game_id`) 맞춤 추천 필터링 + 연산 결과 캐싱(동일 스펙 + 동일 게임)

### 📊 통합 대시보드 (Interactive Dashboard)
- 스팀/라이엇 게임 플레이타임 및 업적 달성률 게이지 차트 시각화
- 현재 날짜 기준 최근 7일 동적 플레이 시간 통계 바 차트 (한글 요일 레이블)
- 하드웨어 병목 기반 업그레이드 타겟 광고 위젯

### 🔐 외부 소셜 계정 연동 (Passport.js OAuth 2.0 / OpenID)
- `passport-steam` 및 `passport-oauth2`를 활용한 실제 스팀/라이엇 인증 서버 리다이렉트 구현
- 계정 연동(Link) / 해제(Unlink) 기능으로 기존 계정에 소셜 계정 바인딩
- Vercel Preview 대응 동적 OAuth 리다이렉션 (`x-forwarded-host` 기반)
- API 키 누락 방어를 위한 In-Memory Fallback(우회 로그인) 미들웨어 탑재

### 💬 커뮤니티 게시판 (Community Board)
- 4개 카테고리(자유💬/팁💡/하드웨어🖥️/버그🐛) 탭 필터링 + 카테고리 뱃지
- 좋아요 토글 시스템 (`post_likes` 테이블 기반 중복 방지)
- 인기글 사이드바 (좋아요 순 상위 5개, 1~3위 금색 강조)
- 서버사이드 페이지네이션 + 보기 개수 선택(10/20/30/40/50개)
- 다각화 정렬 (최신순/오래된순/인기순/조회수순/가나다순)
- 관리자 게시글 상단 고정(Pinning) + 골드 하이라이트 시각 표시
- 게시글 작성/수정/삭제 + 댓글 작성/삭제

### 👤 마이페이지 (My Page)
- 프로필 정보 및 소셜 연동 뱃지 현황 통합 뷰
- 닉네임 변경 (서버 동기화 + 사이드바 실시간 반영)
- 구독 정보 카드 (Free → PRO 업그레이드 배너 / PRO 멤버십 뱃지)
- 활동 집계 요약 카드 (작성 글/댓글 수, PC 사양 수, 연동 게임 수)
- 내가 작성한 게시글/댓글 목록 탭 (페이지네이션 + 정렬)

### 🛡️ 관리자 대시보드 (Admin Dashboard)
- **개요 탭**: KPI 카드 4종 + Recharts 시각화 차트 3종 (일별 가입자 추이 LineChart, 구독 분포 PieChart, 카테고리별 게시글 BarChart)
- **유저 관리 탭**: 실시간 검색/필터 + 역할 변경(user ↔ admin) + 차단/해제
- **게시물 관리 탭**: 숨김/해제 토글 + 삭제 + 상단 고정(Pin) + 서버사이드 페이지네이션

### ⚡ 풀스택 계층형 아키텍처 (Layered Architecture)
- React/Vite 기반의 클라이언트와 Express 기반의 API 서버 분리 (MVC 패턴)
- JWT Access/Refresh Token 이중 토큰 인증 + 자동 갱신 인터셉터
- 이메일 인증 코드 시스템 (6자리 코드 발급 + 검증 + 재발송)

### 💳 구독 및 결제 (Subscription & Payment)
- 토스페이먼츠(TossPayments) 결제 위젯 연동
- Free / Premium 구독 티어 시스템
- 프리미엄 전용 상위 1% 통계 위젯

### 🔒 인프라 및 보안 강화 (DevOps & Security)
- JWT Secret 환경변수 기반 관리 + 프로덕션 가드
- Vercel Postgres(Neon Cloud DB) 완벽 연동 및 In-Memory Fallback 시스템 구축
- Helmet 보안 헤더 + express-rate-limit + PBKDF2(SHA-512) 비밀번호 해싱
- UUID 포맷 검증 가드 (PostgreSQL 캐스팅 에러 방지)
- Vercel Serverless 환경 Stateless 토큰 추적 (세션 유실 방지)

### 🎨 UX 고도화 (UX Enhancement)
- CSS Custom Properties 기반 다크/라이트 이중 테마 시스템
- 클라이언트사이드 실시간 검색 + 알림 시스템 MVP + 피드백 버튼 실동작
- SessionStorage 기반 관리자 패널 상태 보존 (탭/검색어 유지)
- 스마트 히스토리 백 네비게이션

---

## 🛠️ 기술 스택 (Tech Stack)

### Frontend
- **Framework**: React 18 (Vite)
- **Styling**: TailwindCSS, PostCSS, CSS Custom Properties
- **State**: Zustand
- **Visualization**: Recharts, Lucide-React
- **Payment**: TossPayments Checkout Widget

### Backend & Algorithm
- **Environment**: Node.js, Express.js
- **Database**: PostgreSQL (pg), In-Memory Mock Fallback
- **Auth**: Passport.js (Steam OpenID, OAuth 2.0), JWT (Access + Refresh Token)
- **Security**: PBKDF2 (SHA-512), Crypto, Helmet, express-rate-limit
- **Email**: 인증 코드 발급 시스템 (emailService.js)

### DevOps & Deployment
- **Hosting / CI/CD**: Vercel (Serverless Functions)
- **Database**: Vercel Postgres (Neon Cloud DB)
- **Version Control**: Git / GitHub

---

## 📂 프로젝트 구조 (Project Structure)

```
webplatform_w10/                    # 최종 풀스택 코드
├── client/                         # React Frontend
│   └── src/
│       ├── api/apiClient.js        # Axios 인스턴스 + 인터셉터 + API 함수 40+개
│       ├── components/
│       │   ├── layout/MainLayout.jsx        # 사이드바 + 메인 레이아웃
│       │   ├── dashboard/                   # 대시보드 위젯 (PremiumStatsWidget 등)
│       │   ├── payment/TossCheckoutWidget.jsx
│       │   ├── ads/                         # 타겟 광고 컴포넌트
│       │   ├── HardwareProfileForm.jsx      # 하드웨어 등록 폼
│       │   ├── RecommendationList.jsx       # 추천 프로필 목록 + 상세 모달
│       │   └── NotificationDropdown.jsx     # 알림 드롭다운
│       ├── pages/                   # 15개 페이지
│       │   ├── LandingPage.jsx      # 랜딩 페이지
│       │   ├── AuthPage.jsx         # 로그인/회원가입 (이메일 인증)
│       │   ├── DashboardPage.jsx    # 메인 대시보드
│       │   ├── HardwarePage.jsx     # 하드웨어 프로필 등록
│       │   ├── RecommendPage.jsx    # 최적화 추천 허브
│       │   ├── CommunityPage.jsx    # 커뮤니티 게시판
│       │   ├── PostDetail.jsx       # 게시글 상세 (좋아요/수정/삭제)
│       │   ├── PostWritePage.jsx    # 게시글 작성/수정
│       │   ├── MyPage.jsx           # 마이페이지 (프로필/활동 통합)
│       │   ├── AdminDashboard.jsx   # 관리자 대시보드
│       │   ├── SubscriptionPage.jsx # 구독 결제
│       │   ├── SettingsPage.jsx     # 테마/언어 설정
│       │   └── Payment*.jsx         # 결제 성공/실패
│       ├── store/                   # Zustand 전역 상태
│       │   ├── useAuthStore.js      # 인증 + 소셜 연동 상태
│       │   └── useNotificationStore.js
│       ├── hooks/useSEO.js          # 동적 메타태그 SEO 훅
│       └── features/               # 기능별 모듈
│           ├── dashboard/DashboardCharts.jsx
│           └── settings/SettingsView.jsx
├── server/                          # Express Backend
│   ├── server.js                    # 앱 엔트리 + 미들웨어 설정
│   └── src/
│       ├── config/
│       │   ├── db.js                # PostgreSQL 연결 + Mock DB 쿼리 파서
│       │   ├── mockDb.js            # In-Memory 시딩 데이터 (유저/게시글/프로필 등)
│       │   ├── passport.js          # Passport 전략 (Steam/Riot)
│       │   └── hardwareCatalog.js   # 하드웨어 카탈로그
│       ├── controllers/             # 8개 컨트롤러
│       │   ├── authController.js    # 회원가입/로그인/OAuth/이메일인증
│       │   ├── profileController.js # 하드웨어 프로필 CRUD
│       │   ├── recommendationController.js  # 매칭 엔진 API
│       │   ├── postController.js    # 게시판 CRUD + 좋아요/핀
│       │   ├── adminController.js   # 관리자 통계/유저관리/게시물관리
│       │   ├── gameController.js    # 게임 라이브러리 동기화
│       │   ├── paymentController.js # 결제 처리
│       │   └── statsController.js   # 프리미엄 통계
│       ├── routes/                  # 10개 라우트 파일
│       ├── middlewares/             # JWT 인증 + 에러 핸들링
│       ├── services/                # 비즈니스 로직
│       │   ├── matchingEngine.js    # L1-Norm 매칭 알고리즘
│       │   ├── steamService.js      # Steam API 연동
│       │   └── emailService.js      # 이메일 인증 코드 발송
│       └── utils/detectBottleneck.js
├── api/index.js                     # Vercel Serverless 엔트리
├── vercel.json                      # Vercel 배포 설정
└── package.json                     # 루트 스크립트 (동시 실행)
```

---

## 📊 현재 시스템 규모

| 항목 | 수치 |
|:---|:---:|
| **프론트엔드 페이지** | 15개 |
| **백엔드 API 엔드포인트** | 40개+ |
| **데이터베이스 테이블** | 8개 (`users`, `hardware_profiles`, `games`, `optimization_profiles`, `posts`, `comments`, `post_likes`, `email_verification_codes`) |
| **프론트엔드 API 함수** | 40개+ |
| **컨트롤러** | 8개 |
| **라우트 파일** | 10개 |

---

## 📅 주차별 프로젝트 마일스톤 (15-Week Roadmap)

| 주차 | 단계 | 주요 내용 및 산출물 |
|:---:|:---|:---|
| **2주차** | **Ideation** | 웹 서비스 플랫폼 기획 및 핵심 아이디어 정의 |
| **3주차** | **Milestone** | 서비스 개념 설계 및 세부 기획 마일스톤 수립 |
| **4주차** | **PRD** | 제품 요구사항 정의서(PRD) 및 상세 기능 명세서 작성 |
| **5주차** | **UI/UX** | UI/UX 프로토타입 구현 및 사용자 화면 흐름(Flow) 정의 |
| **6주차** | **Architecture** | 전체 시스템 디자인 및 데이터베이스/서버 아키텍처 명세 |
| **7주차** | **Frontend** | React 기반 클라이언트 UI 컴포넌트 마크업 및 퍼블리싱 |
| **8주차** | **Backend** | Node.js Express 백엔드 라우팅 및 PostgreSQL DB 스키마 구축 |
| **9주차** | **Algorithm** | 성능 계수 기반 하드웨어 매칭 엔진(유사도 알고리즘) 모델링 |
| **10주차** | **Integration** | 클라이언트-서버 간 비동기 API 통신 연동 및 대시보드 시각화(`localhost` 환경) |
| **11주차** | **QA & Fixes** | Steam 계정 연동 세션 충돌 오류 픽스 및 예외 처리 고도화 |
| **12주차** | **Deployment** | 모노레포 환경 Vercel 상용 자동화 배포 및 크로스플랫폼(glibc/musl) 버그 트러블슈팅 성공 |
| **13주차** | **A11y & SEO** | WCAG 2.1 웹접근성(시맨틱 HTML, ARIA, 포커스 트랩, 키보드 내비) 및 SEO(OG/Twitter, JSON-LD, 동적 메타) 전면 적용 |
| **13주차+** | **OAuth & Security** | Passport.js 소셜 로그인(Steam/Riot) 연동, Fallback 시스템 구축, 대시보드 위젯 UI 개편 |
| **14주차** | **Community & Admin** | 커뮤니티 게시판 고도화(카테고리/좋아요/페이지네이션/인기글), 관리자 대시보드 확장(Recharts 차트 3종, 유저·게시물 관리), DB 스키마 확장 |
| **15주차** | **Verification & Polish** | 기획-코드 정합성 4단계 검증(Feature Audit → RTM → Gap Analysis → Sync QA), UX 고도화(마이페이지 신설, 페이지네이션/정렬 개편), Vercel Preview 동적 OAuth 리다이렉션, 세션 캐시 오염 버그 해결, 추천 엔진 UUID 에러 수정 |

---

## 🌿 버전 관리 및 커밋 컨벤션 (Version Control)

이 프로젝트는 안정적인 서비스 운영과 명확한 히스토리 추적을 위해 **기능별 브랜치 전략**과 **엄격한 커밋 컨벤션**을 따릅니다.

### 1. 브랜치(Branch) 관리 전략
- **`main`**: 항상 배포 가능한 상태를 유지하는 프로덕션(상용) 브랜치입니다. Vercel과 직접 연결되어 있어, 이 브랜치에 코드가 병합(Merge)되면 자동으로 상용 서버에 재배포됩니다.
- **기능 브랜치 (`feat/*`, `fix/*`, `docs/*`)**: 새로운 기능을 개발하거나 버그를 수정할 때 `main`에서 파생되어 작업하는 격리된 공간입니다.
  - 예시: `feat/외부계정연동`, `fix/로그인-버그-수정`
  - 작업이 완벽하게 완료되고 검증(테스트)이 끝나면 `main`으로 병합(Pull Request)합니다.

### 2. 커밋(Commit) 메시지 포맷
모든 커밋 메시지는 어떤 변화가 있었는지 직관적으로 알 수 있도록 아래의 포맷을 강제합니다.
- **`타입: 한글 설명`** 형식 준수
  - `feat`: 새로운 기능 추가 (예: `feat: 스팀 및 라이엇 외부 계정 연동 구현`)
  - `fix`: 버그 수정 (예: `fix: JWT Secret 키 불일치로 인한 인증 오류 해결`)
  - `docs`: 문서 수정 (예: `docs: README.md 커밋 컨벤션 규칙 추가`)
  - `style`: 코드 포맷팅, 세미콜론 누락 등 코드 변경이 없는 경우
  - `refactor`: 코드 리팩토링 (기능 변화 없음)
  - `test`: 테스트 코드 추가 및 수정

### 3. 작업 단위 커밋 (Atomic Commits)
- 여러 개의 다른 목적을 가진 수정 사항을 하나의 커밋으로 뭉뚱그려 올리지 않습니다.
- **"하나의 커밋 = 하나의 논리적 작업(또는 하나의 기능)"** 원칙을 고수하여, 각 파일의 역할이나 수정 사항이 커밋 하나에 명확히 담기도록 분할하여 커밋합니다.

---

## 🚀 로컬 실행 방법 (Local Development)

본 프로젝트는 `webplatform_w10` 폴더에서 최종 풀스택 코드가 통합되어 실행됩니다.

```bash
# 1. 최종 작업 디렉토리로 이동
cd webplatform_w10

# 2. 환경변수 설정 (선택 — 없으면 개발용 fallback으로 동작)
cp .env.example .env
# .env 파일을 열어 JWT_SECRET 등 실제 값을 입력하세요

# 3. 의존성 패키지 설치
npm install
cd client && npm install && cd ..

# 4. 로컬 개발 서버 실행 (프론트엔드 + 백엔드 동시 실행)
npm run dev
```
- Frontend: `http://localhost:3000`
- Backend API: `http://localhost:5000`

---
*© 2026 SYNCRIG Project. All rights reserved.*
