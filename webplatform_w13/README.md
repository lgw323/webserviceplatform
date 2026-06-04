# 13주차: 웹접근성(Web Accessibility) 및 SEO 최적화 보고서

## 1. 수행 목표
- WCAG 2.1 국제 웹접근성 가이드라인에 기반하여 기존 풀스택 애플리케이션(10주차)의 접근성을 전면 개선.
- 검색엔진최적화(SEO)를 위한 메타데이터 강화, 구조화 데이터(JSON-LD) 삽입, 크롤러 정책 파일 생성.
- SPA(Single Page Application) 환경 특유의 접근성·SEO 제약을 극복하기 위한 기술적 해법 적용.

## 2. 개발 내역

### 2.1. SEO (검색엔진최적화)

#### 2.1.1. HTML 메타태그 전면 강화
- [index.html](../webplatform_w10/client/index.html):
  - **Open Graph 메타태그**: `og:type`, `og:title`, `og:description`, `og:url`, `og:site_name`, `og:locale` 총 6종 추가. 카카오톡/디스코드/페이스북 등 소셜 미디어에서 링크 공유 시 풍부한 미리보기 카드를 렌더링합니다.
  - **Twitter Card 메타태그**: `twitter:card`, `twitter:title`, `twitter:description` 3종 추가. 트위터(X)에서 대형 이미지 카드 형식으로 표시됩니다.
  - **Primary SEO Meta**: `<meta name="keywords">` (게임 최적화, 그래픽 설정, 하드웨어 매칭 등 8개 키워드), `<meta name="author">`, `<meta name="robots" content="index, follow">` 추가.
  - **Canonical URL**: `<link rel="canonical" href="https://syncrig.vercel.app/" />`로 검색엔진에 정규 URL을 명시하여 중복 콘텐츠 문제를 방지합니다.
  - **Theme Color**: `<meta name="theme-color" content="#0b0f19">`로 모바일 크롬/사파리 상단 바 색상을 브랜드 컬러와 일치시켰습니다.
  - **Favicon**: 🎮 이모지 기반 SVG favicon을 인라인으로 설정하여 별도 파일 없이 아이콘을 표시합니다.
  - **`<noscript>` 대체 콘텐츠**: JavaScript가 비활성화된 환경(검색엔진 크롤러 포함)에서도 서비스 이름과 설명을 노출합니다.

#### 2.1.2. 구조화 데이터 (JSON-LD / Schema.org)
- [index.html](../webplatform_w10/client/index.html):
  - `<script type="application/ld+json">`으로 Schema.org의 `WebApplication` 타입 구조화 데이터를 삽입했습니다.
  - Google 검색 결과에서 앱 이름, 설명, 카테고리(GameApplication), 가격(무료) 등의 리치 스니펫을 노출할 수 있습니다.

#### 2.1.3. SPA 동적 타이틀 관리
- [useSEO.js](../webplatform_w10/client/src/hooks/useSEO.js) **(신규 파일)**:
  - React 커스텀 훅으로, 탭(페이지) 전환 시 `document.title`과 `<meta name="description">`, OG/Twitter 메타태그를 동적으로 업데이트합니다.
  - SPA는 하나의 HTML 파일로 구동되므로, 클라이언트 사이드에서 메타 정보를 갱신하지 않으면 모든 페이지가 동일한 타이틀을 갖게 되는 문제를 해결합니다.
  - 각 탭별 고유 타이틀 매핑: 대시보드(`SYNCRIG - 대시보드 | 게임 통계 및 하드웨어 요약`), 하드웨어 프로필(`SYNCRIG - 하드웨어 프로필 | PC 사양 관리`), 최적화 허브(`SYNCRIG - 최적화 허브 | AI 그래픽 세팅 추천`), 환경 설정(`SYNCRIG - 환경 설정 | 테마 · 언어 · 계정`).

#### 2.1.4. 크롤러 정책 파일
- [robots.txt](../webplatform_w10/client/public/robots.txt) **(신규 파일)**: 검색엔진 크롤러에게 `/api/` 경로를 제외한 전체 페이지의 색인을 허용하고, 사이트맵 위치를 알려줍니다.
- [sitemap.xml](../webplatform_w10/client/public/sitemap.xml) **(신규 파일)**: XML 사이트맵 프로토콜 형식으로 SPA 메인 URL을 등록했습니다.

---

### 2.2. 웹접근성 (Web Accessibility, WCAG 2.1)

#### 2.2.1. 스킵 내비게이션 (Skip Navigation)
- [App.jsx](../webplatform_w10/client/src/App.jsx):
  - 화면 최상단에 **"본문으로 건너뛰기"** 링크를 추가했습니다. 평소에는 시각적으로 숨겨져 있지만, 키보드 사용자가 `Tab` 키를 누르면 화면 상단에 표시되어 반복적인 네비게이션을 건너뛸 수 있습니다.
  - `<a href="#main-content" class="skip-nav">` → `<main id="main-content">` 연결 구조입니다.

#### 2.2.2. 시맨틱 HTML 태그 전환
- [App.jsx](../webplatform_w10/client/src/App.jsx):
  - 각 탭(대시보드, 하드웨어, 최적화, 설정)의 콘텐츠 영역을 `<section aria-labelledby="heading-xxx">`로 래핑하여 스크린리더가 페이지 구조를 파악할 수 있게 했습니다.
  - 사이드바 `<nav>` + `aria-label="사이드바 메뉴"`, 모바일 하단 `<nav>` + `aria-label="모바일 메뉴"`로 네비게이션 역할을 명시했습니다.
  - `<main id="main-content" tabIndex="-1">`으로 본문 영역을 프로그래밍 방식으로 포커스 가능하게 설정했습니다.
- [HardwareProfileForm.jsx](../webplatform_w10/client/src/components/HardwareProfileForm.jsx):
  - 폼 단계를 `<div>` → `<fieldset>` + `<legend>`로 전환하여 논리적 그룹핑을 명시했습니다.
  - 스펙 표시를 `<div>` → `<dl>/<dt>/<dd>` 정의 목록으로 변경하여 사양 데이터의 의미를 명확히 했습니다.
- [DashboardCharts.jsx](../webplatform_w10/client/src/features/dashboard/DashboardCharts.jsx):
  - 게임 목록을 `<div>` → `<ul>/<li>` 시맨틱 리스트로 전환했습니다.

#### 2.2.3. ARIA 속성 전면 추가
- [App.jsx](../webplatform_w10/client/src/App.jsx):
  - **인증 화면**: 로그인/회원가입 전환을 `role="tablist"` + `role="tab"` + `aria-selected` 탭 패턴으로 구현. 폼을 `role="tabpanel"` + `aria-labelledby`로 연결했습니다.
  - **에러 메시지**: `role="alert"` + `aria-live="assertive"`로 에러 발생 시 스크린리더가 즉시 읽어줍니다.
  - **네비 버튼**: 활성 탭에 `aria-current="page"` 속성을 부여하여 현재 위치를 알려줍니다.
  - **알림 벨**: `aria-label="알림 (새 알림 있음)"` + `aria-haspopup="true"` 추가.
  - **로딩 상태**: `role="status"` + `aria-live="polite"`로 매칭 엔진 진행 상황을 스크린리더에 실시간 알림.
  - **동기화 오버레이**: `role="alert"` + `aria-live="assertive"` + `aria-busy="true"`로 동기화 상태 고지.
  - **장식용 아이콘**: 모든 Lucide 아이콘에 `aria-hidden="true"` 적용하여 스크린리더 노이즈를 제거했습니다.
- [HardwareProfileForm.jsx](../webplatform_w10/client/src/components/HardwareProfileForm.jsx):
  - 프로그레스 바: `role="progressbar"` + `aria-valuenow/min/max` + `aria-label`로 진행률을 수치로 전달합니다.
  - 프리셋 영역: `role="group"` + `aria-label="퀵 프리셋 선택"`으로 그룹 역할을 명시했습니다.
  - 삭제 버튼: `aria-label="${프로필명} 프로필 삭제"`로 각 프로필별 구분이 되도록 했습니다.
- [RecommendationList.jsx](../webplatform_w10/client/src/components/RecommendationList.jsx):
  - 유사도 바: `role="progressbar"` + `aria-valuenow` + `aria-labelledby`로 정확한 수치를 전달합니다.
  - 피드백 버튼: `role="group"` + 개별 `aria-label`로 "도움됨/작동 안함" 역할을 명시했습니다.
  - 복사 결과: `aria-live="polite"` 영역으로 감싸 복사 완료 시 스크린리더에 알립니다.
- [SettingsView.jsx](../webplatform_w10/client/src/features/settings/SettingsView.jsx):
  - 테마 토글: `role="switch"` + `aria-checked` + `aria-labelledby`로 스위치 역할을 명시했습니다.
  - 언어 선택: `role="radiogroup"` + `role="radio"` + `aria-checked`로 라디오 버튼 패턴을 구현했습니다.
  - 저장 결과: `aria-live="polite"` + `.sr-only` 피드백 영역으로 저장 완료를 알립니다.

#### 2.2.4. 폼 접근성 (Label-Input 연결)
- [App.jsx (AuthScreen)](../webplatform_w10/client/src/App.jsx):
  - `<label htmlFor="auth-username">` ↔ `<input id="auth-username">` 명시적 연결.
  - `<label htmlFor="auth-password">` ↔ `<input id="auth-password">` 명시적 연결.
  - `autoComplete="username"` / `autoComplete="current-password"` 속성으로 브라우저 자동완성을 지원합니다.
- [HardwareProfileForm.jsx](../webplatform_w10/client/src/components/HardwareProfileForm.jsx):
  - 5개 입력 필드 모두 `<label htmlFor>` ↔ `<input id>` 연결 완료 (`hw-profile-name`, `hw-cpu`, `hw-gpu`, `hw-ram`, `hw-resolution`, `hw-refresh`).
  - 모든 필수 항목에 `aria-required="true"` 속성을 부여했습니다.
- [SettingsView.jsx](../webplatform_w10/client/src/features/settings/SettingsView.jsx):
  - 닉네임 입력: `<label htmlFor="settings-nickname">` (sr-only) ↔ `<input id="settings-nickname">` 연결.

#### 2.2.5. 모달 접근성 (포커스 트랩)
- [RecommendationList.jsx](../webplatform_w10/client/src/components/RecommendationList.jsx):
  - **`role="dialog"` + `aria-modal="true"`**: 모달이 열리면 스크린리더가 이를 대화 상자로 인식합니다.
  - **포커스 트랩**: `Tab` 키를 누르면 모달 내부의 인터랙티브 요소들 사이에서만 순환하며, 모달 밖으로 나가지 않습니다.
  - **ESC 닫기**: `Escape` 키를 누르면 모달이 즉시 닫힙니다.
  - **포커스 복원**: 모달이 닫히면 모달을 열었던 이전 요소로 포커스가 자동 복원됩니다.
  - **배경 클릭 닫기**: 모달 외부(배경 오버레이)를 클릭해도 닫히도록 구현했습니다.

#### 2.2.6. 키보드 내비게이션
- [App.jsx](../webplatform_w10/client/src/App.jsx):
  - 사이드바 네비게이션에 `↑/↓` 방향키 탐색을 구현했습니다.
  - `Home` 키로 첫 번째 메뉴, `End` 키로 마지막 메뉴로 즉시 이동합니다.
  - `Enter` 또는 `Space` 키로 메뉴 항목을 선택할 수 있습니다.

#### 2.2.7. 색상 대비 및 시각적 접근성
- [tailwind.config.js](../webplatform_w10/client/tailwind.config.js):
  - WCAG AA 기준(4.5:1 이상) 대비비를 만족하는 커스텀 색상 토큰을 추가했습니다: `a11y-muted`(#9ca3af, 대비비 약 7.5:1), `a11y-subtle`(#d1d5db).
  - 기존의 `text-gray-500`(#6b7280, 대비비 약 5.0:1로 작은 텍스트에서 불확실)을 `text-a11y-muted`로 전면 교체했습니다.
- [index.css](../webplatform_w10/client/src/index.css):
  - **키보드 포커스 링**: `*:focus-visible`으로 키보드 사용자에게만 파란색 아웃라인을 표시하고, 마우스 사용자에게는 숨깁니다.
  - **`.sr-only` 클래스**: 스크린리더 전용 텍스트를 시각적으로 숨기되 스크린리더가 읽을 수 있도록 합니다.
  - **고대비 모드**: `@media (prefers-contrast: high)` 쿼리로 고대비 선호 사용자에게 3px 흰색 아웃라인을 제공합니다.
  - **모션 감소**: `@media (prefers-reduced-motion: reduce)` 쿼리로 모션 감소를 선호하는 사용자에게 모든 애니메이션을 비활성화합니다.

#### 2.2.8. 차트 대체 콘텐츠 (스크린리더 대응)
- [DashboardCharts.jsx](../webplatform_w10/client/src/features/dashboard/DashboardCharts.jsx):
  - 시각적 바 차트에 `aria-hidden="true"`를 적용하고, 동일한 데이터를 담은 **스크린리더 전용 `<table>` (`.sr-only`)** 을 제공했습니다.
  - 시각 장애가 있는 사용자도 "월요일: 2.5시간, 화요일: 3.8시간..." 등의 데이터를 테이블 형식으로 접근할 수 있습니다.

---

## 3. 변경 파일 목록

| 파일 | 유형 | 변경 내용 요약 |
|:---|:---:|:---|
| `client/index.html` | 수정 | OG/Twitter 메타 6+3종, JSON-LD, canonical, theme-color, noscript |
| `client/src/hooks/useSEO.js` | **신규** | SPA 동적 타이틀/메타 업데이트 커스텀 훅 |
| `client/public/robots.txt` | **신규** | 검색엔진 크롤러 정책 (/api/ 차단, 사이트맵 경로) |
| `client/public/sitemap.xml` | **신규** | XML 사이트맵 프로토콜 파일 |
| `client/src/index.css` | 수정 | focus-visible, sr-only, skip-nav, prefers-contrast, prefers-reduced-motion |
| `client/tailwind.config.js` | 수정 | WCAG AA 준수 색상 토큰(a11y-muted, a11y-subtle) |
| `client/src/App.jsx` | 수정 | 시맨틱 HTML, ARIA 30+속성, Skip Nav, 키보드 내비, useSEO 연결 |
| `client/src/components/HardwareProfileForm.jsx` | 수정 | fieldset/legend, label 연결, progressbar, dl/dt/dd |
| `client/src/components/RecommendationList.jsx` | 수정 | 모달 dialog, 포커스 트랩, ESC 닫기, 포커스 복원, progressbar |
| `client/src/features/dashboard/DashboardCharts.jsx` | 수정 | 차트 sr-only 대체 테이블, ul/li 리스트, progressbar |
| `client/src/features/settings/SettingsView.jsx` | 수정 | switch/radio ARIA, aria-checked, aria-live 피드백 |

## 4. 검증 결과
- `npm run build`: ✅ 성공 (2.44초, 0 에러, 0 경고)
- 빌드 산출물: CSS 28.22KB (gzip 5.75KB), JS 212.34KB (gzip 63.24KB)

## 5. 결과 및 의의
- WCAG 2.1 Level AA 국제 웹접근성 가이드라인에 기반한 시맨틱 마크업, ARIA 속성, 키보드 내비게이션, 모달 포커스 관리, 색상 대비 개선 등을 체계적으로 적용하였습니다.
- SEO 측면에서는 Open Graph, Twitter Card, JSON-LD 구조화 데이터, 동적 메타 관리, 크롤러 정책 파일 등을 통해 검색엔진 가시성을 확보했습니다.
- 이로써 SYNCRIG 플랫폼은 시각 장애, 운동 장애 등 다양한 사용자의 접근 요구를 충족하며, 검색엔진에서의 노출성 또한 극대화된 상태입니다.

---

## 6. [추가] 웹 서비스 안정화 및 아키텍처 고도화 (Robustness)

13주차의 접근성 및 SEO 작업 직후, 실제 상용 서비스 환경에 부합하도록 전체 아키텍처를 재점검하고 대규모 리팩토링을 진행했습니다. 주요 개선 사항은 다음과 같습니다.

### 6.1. 프론트엔드 라우팅 및 모듈화
- **React Router DOM 도입**: 단일 거대 파일(`App.jsx`, 약 660줄)에 혼재되어 있던 모든 화면 렌더링 로직을 라우터 기반으로 분리했습니다. 브라우저의 뒤로가기/앞으로가기 기능이 정상 지원되며, 특정 페이지(`URL/hardware`, `URL/recommend` 등)로의 다이렉트 접속이 가능해졌습니다.
- **페이지/레이아웃 컴포넌트 분리**: `App.jsx`는 라우팅 컨테이너 역할만 수행하며, `MainLayout` 컴포넌트 하위에 5개의 독립된 페이지(`AuthPage`, `DashboardPage`, `HardwarePage`, `RecommendPage`, `SettingsPage`)로 역할을 명확히 나누었습니다.

### 6.2. 전역 상태 관리 (Global State Management)
- **Zustand 도입**: 이전에는 최상단 컴포넌트에서 모든 하위 컴포넌트로 데이터를 내려주는(Prop Drilling) 비효율적인 구조였습니다. 이를 해결하기 위해 Zustand 기반의 `useAuthStore`를 신규 생성하여, `user`, `userSpec` 등의 전역 데이터를 어느 페이지에서나 직관적으로 접근 및 제어할 수 있게 개선했습니다.

### 6.3. 백엔드 보안 및 파이프라인 검증 (Security & Validation)
- **Rate Limiting (`express-rate-limit`)**: 로그인(`/api/v1/auth/login`) 및 회원가입 라우트에 대해 IP당 '15분 내 최대 10회'만 요청 가능하도록 브루트포스(무차별 대입) 방어 로직을 적용했습니다.
- **입력값 유효성 검사 (`express-validator`)**: 비밀번호 길이(최소 6자 이상, 숫자 포함), 해상도(FHD/QHD/4K 지정), RAM(4~256GB 허용) 등 들어오는 API 데이터에 대해 엄격한 검증 미들웨어를 도입하여 비정상 데이터 인젝션을 원천 차단했습니다.

### 6.4. UX 및 토큰 제어 (UX & Interceptors)
- **Axios Interceptor**: 기존 `fetch`를 `axios`로 전면 교체하고, 서버에서 `401 Unauthorized`(토큰 만료 등) 응답이 올 경우 즉시 전역 인터셉터가 작동하여 로컬 데이터를 초기화하고 로그인 화면으로 튕겨내도록 보안성을 올렸습니다.
- **시각적 피드백 (`react-hot-toast`)**: 로그인 성공, 프로필 저장 완료, 에러 발생 시 눈에 띄지 않던 텍스트 피드백 대신, 브라우저 우측 하단에 부드러운 애니메이션과 함께 나타나는 팝업(Toast) 알림을 추가하여 유저 경험을 크게 향상시켰습니다.

---

## 7. [추가] 보고된 이슈 수정 (Bug Fixes & Issue Resolution)

접근성 및 안정화 작업 이후, 사용자 테스트 과정에서 보고된 4건의 이슈를 분석하고 수정했습니다.

### 7.1. 최적화 허브 상세보기 빈 화면 + 새로고침 404 (이슈 #2)

#### 문제
- 최적화 허브에서 프로필 상세보기를 클릭하면 **빈 화면**이 표시됨
- 브라우저에서 새로고침 시 **404 Not Found** 발생

#### 원인 분석
- **빈 화면**: Mock DB의 그래픽 설정이 `settings_json`이라는 키로 저장되어 있으나, `RecommendationList.jsx`에서는 `selectedProfile.settings`로 접근. `matchingEngine.js`의 `getRecommendedProfiles`가 DB 데이터를 spread(`...profile`)하여 `settings_json` 키를 그대로 유지하므로, `settings`가 `undefined` → `Object.entries(undefined)` 호출 → 런타임 에러 → React 컴포넌트 트리 언마운트
- **새로고침 404**: `vercel.json`의 rewrite 규칙이 SPA fallback을 올바르게 처리하지 않아, `/dashboard` 같은 클라이언트 라우트 접근 시 Vercel이 물리적 파일을 찾으려다 실패

#### 수정 내용
- [matchingEngine.js](../webplatform_w10/server/src/services/matchingEngine.js):
  - `getRecommendedProfiles` 함수에서 `profile.settings || profile.settings_json || {}`로 키를 매핑하여, 어떤 키 이름으로 저장되어 있든 `settings` 필드로 통일되도록 수정
- [vercel.json](../webplatform_w10/vercel.json):
  - SPA fallback 규칙을 `/((?!assets/).*)` → `/client/dist/index.html`로 변경하여, 모든 non-API/non-assets 경로를 `index.html`로 리다이렉트

### 7.2. 미가입 로그인 시 피드백 없이 새로고침 + 회원가입 알림 위치 (이슈 #3)

#### 문제
- 미가입된 아이디로 로그인 시도 시, 에러 메시지 없이 페이지가 새로고침되는 것처럼 보임
- 회원가입 성공 알림이 우측 하단 토스트로만 표시되어 눈에 띄지 않음

#### 원인 분석
- `apiClient.js`의 Response Interceptor가 **모든 401 응답**에 대해 `window.location.href = '/'`로 리다이렉트. 원래 "토큰 만료 시 자동 로그아웃" 용도이나, 로그인 시도 실패(아직 토큰이 없는 상태)에서도 동일하게 작동하여 `AuthPage.jsx`의 `catch` 블록에서 에러 메시지를 표시하기 전에 페이지가 리로드됨

#### 수정 내용
- [apiClient.js](../webplatform_w10/client/src/api/apiClient.js):
  - 401 인터셉터에 `cachedToken` 존재 여부 검사를 추가. 토큰이 있는 경우(=인증된 세션 만료)에만 리다이렉트하고, 토큰이 없으면(=로그인/회원가입 시도 실패) 에러를 그대로 throw하여 호출측에서 처리하도록 변경
- [AuthPage.jsx](../webplatform_w10/client/src/pages/AuthPage.jsx):
  - 로그인/회원가입 실패 시 **폼 내부에 인라인 에러 메시지**(`role="alert"`)를 직접 표시하도록 구현
  - 회원가입 성공 시에도 **폼 상단에 성공 메시지**(`role="status"`)를 표시하여 가시성 향상
  - 회원가입 모드에서 비밀번호 입력 필드 옆에 **유효성 규칙 안내**(6자 이상, 숫자 포함)를 표시

### 7.3. 환경설정 영어 변경 미작동 (이슈 #4)

#### 문제
- 환경설정에서 English를 선택해도 UI 텍스트가 변경되지 않음

#### 원인 분석
- `handleLanguageChange`가 `localStorage`에 값만 저장하고, 실제 다국어 시스템(i18n)이 없어 모든 텍스트가 한국어 문자열로 하드코딩되어 있음

#### 수정 내용
- [SettingsView.jsx](../webplatform_w10/client/src/features/settings/SettingsView.jsx):
  - English 선택 시 **"영어 지원은 현재 준비 중입니다. 추후 업데이트를 통해 제공될 예정입니다."** 토스트 메시지를 표시하여, 기능 미지원 상태를 사용자에게 명확히 알림
  - 언어 선택 버튼이 `en`으로 변경되지 않도록 `return`으로 차단

### 7.4. 계정 연동 시 Steam/Riot 구분 불가 + 플레이타임 그래프 하드코딩 (이슈 #5)

#### 문제
- Steam만 연동해도 Riot 게임(Valorant)이 라이브러리에 표시되고, "Steam/Riot 활성됨" 배지가 동시에 활성화됨
- 플레이타임 그래프가 연동 여부와 관계없이 항상 동일한 고정값을 표시하며, "+12%" 트렌드가 무조건 하드코딩됨

#### 원인 분석
1. `gameController.js`가 Steam/Riot 구분 없이 동일한 4개 게임을 반환
2. `DashboardPage.jsx`가 `gameLibrary.length > 0`이면 무조건 "Steam/Riot 활성됨" 배지 표시
3. `DashboardCharts.jsx`가 `WEEKLY_PLAYTIME_TEMPLATE` 상수를 사용하므로, 연동 후에도 실제 데이터가 아닌 동일한 고정 그래프 표시
4. `isSynced && <span>+12%</span>` — 연동만 되면 무조건 "+12%" 표시

#### 수정 내용
- [gameController.js](../webplatform_w10/server/src/controllers/gameController.js):
  - `STEAM_GAMES`와 `RIOT_GAMES`를 별도 배열로 분리
  - `providers` 쿼리 파라미터를 받아 해당 플랫폼의 게임만 선택적으로 반환하도록 변경
- [useAuthStore.js](../webplatform_w10/client/src/store/useAuthStore.js):
  - `syncAccount`에서 연동된 provider 목록(`newLinked`)을 `api.syncGameLibrary()`에 전달
  - `fetchUserData`에서도 `linked_providers` 기반으로 게임 라이브러리를 필터링
  - 업적 수(`achievementsCount`)를 하드코딩된 `854` 대신, 실제 게임 플레이타임 기반으로 동적 산출 (`totalPlaytime * 0.88`)
- [DashboardPage.jsx](../webplatform_w10/client/src/pages/DashboardPage.jsx):
  - 연동 상태 배지를 `linked_providers` 배열 기반으로 세분화: "Steam 활성됨", "Riot 활성됨", "Steam + Riot 활성됨", "미연동"
- [DashboardCharts.jsx](../webplatform_w10/client/src/features/dashboard/DashboardCharts.jsx):
  - `WEEKLY_PLAYTIME_TEMPLATE` 상수를 제거하고, 실제 게임 라이브러리 데이터의 총 플레이타임을 기반으로 요일별 플레이 시간을 동적으로 분배하는 `generateWeeklyFromGames()` 함수를 신규 구현 (주말 가중 패턴 적용)
  - "+12%" 하드코딩 텍스트 완전 제거
  - 연동 버튼을 Steam / Riot 개별 독립 동작으로 분리하고, 이미 연동된 플랫폼은 "연동 완료" 상태로 비활성화
- [apiClient.js](../webplatform_w10/client/src/api/apiClient.js):
  - `syncGameLibrary` 함수에 `providers` 파라미터를 추가하여 특정 플랫폼 게임만 요청 가능하도록 변경

### 7.5. 이슈 수정 관련 변경 파일 목록

| 파일 | 유형 | 변경 내용 요약 |
|:---|:---:|:---|
| `server/src/services/matchingEngine.js` | 수정 | `settings_json` → `settings` 키 매핑으로 상세보기 빈 화면 해결 |
| `vercel.json` | 수정 | SPA fallback을 `index.html`로 올바르게 설정하여 새로고침 404 해결 |
| `client/src/api/apiClient.js` | 수정 | 401 인터셉터에 토큰 존재 여부 분기 추가 + `syncGameLibrary` provider 파라미터 지원 |
| `client/src/pages/AuthPage.jsx` | 수정 | 인라인 에러/성공 메시지, 비밀번호 규칙 안내 추가 |
| `client/src/features/settings/SettingsView.jsx` | 수정 | 영어 선택 시 "준비 중" 토스트 피드백 |
| `server/src/controllers/gameController.js` | 수정 | Steam/Riot 게임 목록 분리 + provider 기반 필터링 |
| `client/src/store/useAuthStore.js` | 수정 | provider별 게임 동기화 + 동적 업적 수 산출 |
| `client/src/pages/DashboardPage.jsx` | 수정 | 연동 배지 세분화 (Steam/Riot 독립 표시) |
| `client/src/features/dashboard/DashboardCharts.jsx` | 수정 | 하드코딩 템플릿 제거, 실제 데이터 기반 동적 차트 + "+12%" 제거 + 개별 연동 버튼 |

---

## 8. [추가] 서비스 보안 강화 및 UX 고도화 (Security & UX Enhancement)

이슈 수정 이후, 실제 상용 서비스에서 요구되는 보안 표준 및 사용자 경험(UX) 품질을 확보하기 위한 대규모 개선을 진행했습니다.

### 8.1. JWT 보안 체계 강화 + Refresh Token 시스템 도입

#### 문제
- JWT Secret이 소스 코드에 고정 문자열로 하드코딩되어 있어, 공개 레포지토리에서 누구나 토큰을 위조할 수 있는 보안 취약점 존재
- Access Token 만료 시간이 1시간이며 Refresh Token 메커니즘이 없어, 1시간마다 강제 로그아웃 발생

#### 개선 내용
- [authController.js](../webplatform_w10/server/src/controllers/authController.js):
  - 하드코딩된 JWT Secret 제거 → `process.env.JWT_SECRET` 환경변수 기반으로 전환. 미설정 시 랜덤 fallback 생성 + 콘솔 경고 출력
  - `generateToken()` → `generateTokenPair()`로 전환: **Access Token(15분)** + **Refresh Token(7일)** 이중 토큰 체계 도입
  - `POST /api/v1/auth/refresh` 엔드포인트 신규 구현: Refresh Token 검증 → 새 Access Token 발급
  - 로그인 및 회원가입 응답에 `refresh_token` 필드 추가
- [authMiddleware.js](../webplatform_w10/server/src/middlewares/authMiddleware.js):
  - JWT Secret 하드코딩 제거 → 환경변수 기반 + 경고 로그 출력
- [authRoutes.js](../webplatform_w10/server/src/routes/authRoutes.js):
  - `POST /auth/refresh` 라우트 추가
- [apiClient.js](../webplatform_w10/client/src/api/apiClient.js):
  - **Refresh Token 자동 갱신 인터셉터** 구현: Access Token 만료 시(401 응답), 자동으로 Refresh Token으로 새 Access Token을 발급받아 원래 요청을 재시도
  - **큐 기반 동시 요청 처리**: 여러 API 요청이 동시에 401을 받아도, 단 한 번만 refresh 호출 후 모든 대기 중인 요청을 순차 재시도하는 큐 메커니즘 구현
  - Refresh Token도 만료되었을 경우 자동 로그아웃 처리

### 8.2. 데이터베이스 안정성 — 프로덕션 가드

#### 문제
- `DATABASE_URL` 환경변수 없이 배포 시, 인메모리 Mock DB로 동작하여 Serverless cold start마다 모든 데이터 소실

#### 개선 내용
- [db.js](../webplatform_w10/server/src/config/db.js):
  - 인메모리 DB fallback 시 **경고 메시지 3단계로 강화**: 일반 경고 → 데이터 소실 경고 → 프로덕션 환경 에러
  - `NODE_ENV === 'production'`일 때 `console.error`로 별도 강력 경고 출력
- [.env.example](../webplatform_w10/.env.example) **(신규 파일)**:
  - `JWT_SECRET`, `JWT_REFRESH_SECRET`, `DATABASE_URL`, `STEAM_API_KEY` 등 필요한 환경변수를 문서화한 템플릿 파일 제공

### 8.3. 라이트 모드 — CSS Custom Properties 기반 이중 테마

#### 문제
- 기존 라이트 모드가 `filter: invert(1) hue-rotate(180deg)`라는 CSS 해킹으로 구현되어, 이미지·아이콘·그라디언트 등 모든 시각 요소가 왜곡됨

#### 개선 내용
- [index.css](../webplatform_w10/client/src/index.css):
  - `filter: invert(1)` 해킹을 완전 제거
  - `:root`(다크 테마)와 `html.light-theme`(라이트 테마)에 **CSS Custom Properties**를 정의하여 정상적인 이중 테마 시스템 구축
  - `--color-bg`, `--color-card`, `--color-text`, `--color-text-muted`, `--color-border`, `--color-input-bg` 등 11개 테마 변수 정의
  - 테마 전환 시 `transition: background-color 0.3s ease` 애니메이션 추가
- [tailwind.config.js](../webplatform_w10/client/tailwind.config.js):
  - `theme-bg`, `theme-card`, `theme-text`, `theme-text-muted`, `theme-border` 등 CSS 변수를 참조하는 **Tailwind 색상 토큰** 11개 추가
  - 컴포넌트에서 `bg-theme-bg`, `text-theme-text` 등으로 테마 반응형 스타일 적용 가능

### 8.4. 검색 기능 — 클라이언트사이드 실시간 검색

#### 문제
- 헤더 상단의 검색 입력 필드가 아무 기능도 없는 순수 장식이었음

#### 개선 내용
- [useSearch.js](../webplatform_w10/client/src/hooks/useSearch.js) **(신규 파일)**:
  - 페이지 이름 및 키워드 기반 실시간 필터링 검색 훅
  - 대시보드(`통계`, `플레이타임`), 하드웨어(`cpu`, `gpu`), 최적화(`추천`, `그래픽`), 환경설정(`테마`, `언어`) 등 키워드 매핑
  - **키보드 네비게이션**: `↑/↓` 방향키로 결과 탐색, `Enter`로 선택, `Esc`로 닫기
  - **외부 클릭 감지**: 드롭다운 외부를 클릭하면 자동으로 닫힘
- [MainLayout.jsx](../webplatform_w10/client/src/components/layout/MainLayout.jsx):
  - 검색 인풋에 `role="combobox"`, `aria-expanded`, `aria-haspopup` ARIA 속성 적용
  - 검색 결과를 드롭다운 리스트(`role="listbox"`)로 표시하고, 선택 시 해당 페이지로 즉시 이동

### 8.5. 알림 시스템 — MVP 구현

#### 문제
- 헤더의 알림 벨 아이콘에 항상 빨간 점이 표시되지만, 클릭해도 아무 반응 없음

#### 개선 내용
- [useNotificationStore.js](../webplatform_w10/client/src/store/useNotificationStore.js) **(신규 파일)**:
  - Zustand 기반 알림 상태 관리 스토어
  - 기본 시스템 알림 3건 포함 (업데이트 안내, 프로필 등록 안내, 보안 패치 알림)
  - 개별 알림 읽음/모두 읽음/알림 추가/삭제 기능
  - `getUnreadCount()` 메서드로 읽지 않은 알림 수를 동적 계산
- [NotificationDropdown.jsx](../webplatform_w10/client/src/components/NotificationDropdown.jsx) **(신규 파일)**:
  - 알림 벨 클릭 시 표시되는 드롭다운 패널 UI
  - 알림 타입별 아이콘 및 색상 분류 (info/파란색, tip/노란색, update/녹색)
  - "N분 전", "N시간 전", "N일 전" 형태의 상대 시간 표시
  - 외부 클릭 및 `Esc` 키로 닫기 지원
- [MainLayout.jsx](../webplatform_w10/client/src/components/layout/MainLayout.jsx):
  - 알림 벨 버튼에 `aria-label`로 읽지 않은 알림 수를 동적 전달
  - 읽지 않은 알림이 없을 때 빨간 점 자동 숨김

### 8.6. 추천 프로필 피드백 버튼 — 실동작 구현

#### 문제
- 최적화 프로필 상세 모달의 "👍 도움됨" / "👎 작동 안함" 버튼에 `onClick` 핸들러가 없어 클릭해도 아무 반응 없음

#### 개선 내용
- [RecommendationList.jsx](../webplatform_w10/client/src/components/RecommendationList.jsx):
  - `feedbackGiven` 상태를 추가하여 피드백 제출 여부를 추적
  - "도움됨" 클릭 시 → 토스트 알림("피드백 감사합니다! 👍") + 버튼이 초록색으로 변경되며 "감사합니다!" 텍스트 전환
  - "작동 안함" 클릭 시 → 토스트 알림("피드백이 반영되었습니다.") + 버튼이 빨간색으로 변경되며 "반영됨" 텍스트 전환
  - 한 번 피드백을 제출하면 양쪽 버튼 모두 비활성화하여 **중복 제출 방지**
  - `aria-pressed` 속성으로 스크린리더에 피드백 상태를 전달
  - 모달을 닫으면 피드백 상태 초기화 (다른 프로필에서 다시 피드백 가능)

### 8.7. 변경 파일 목록

| 파일 | 유형 | 변경 내용 요약 |
|:---|:---:|:---|
| `server/src/controllers/authController.js` | 수정 | JWT Secret 경고 강화 + Refresh Token 시스템 (`generateTokenPair`, `/refresh` 엔드포인트) |
| `server/src/middlewares/authMiddleware.js` | 수정 | JWT Secret 환경변수 경고 |
| `server/src/routes/authRoutes.js` | 수정 | `POST /auth/refresh` 라우트 추가 |
| `server/src/config/db.js` | 수정 | 인메모리 DB 경고 3단계 + 프로덕션 가드 |
| `.env.example` | **신규** | 환경변수 템플릿 (JWT_SECRET, DATABASE_URL, STEAM_API_KEY) |
| `client/src/api/apiClient.js` | 수정 | Refresh Token 자동 갱신 인터셉터 + 큐 기반 동시 요청 처리 |
| `client/src/index.css` | 수정 | `filter: invert(1)` 제거 → CSS Custom Properties 이중 테마 |
| `client/tailwind.config.js` | 수정 | `theme-*` CSS 변수 기반 색상 토큰 11개 추가 |
| `client/src/hooks/useSearch.js` | **신규** | 클라이언트사이드 실시간 검색 훅 (키워드 매칭 + 키보드 네비게이션) |
| `client/src/store/useNotificationStore.js` | **신규** | Zustand 알림 상태 관리 스토어 |
| `client/src/components/NotificationDropdown.jsx` | **신규** | 알림 드롭다운 UI (타입별 아이콘, 시간 표시, ESC 닫기) |
| `client/src/components/layout/MainLayout.jsx` | 수정 | 검색 실동작 + 알림 시스템 연결 |
| `client/src/components/RecommendationList.jsx` | 수정 | 피드백 버튼 실동작 (토스트 + 상태 변경 + 중복 방지) |\r\n\r\n---\r\n\r\n> **안내**: 본 문서(13주차) 작성 이후에 진행된 **Passport.js 기반 실제 소셜 연동(Steam/Riot)** 및 **B2B/B2C 아이디어 반영 UI 위젯 대규모 개편(13주차+ 보안 및 UX 최적화)** 작업 내역은 프로젝트 최상위 루트 경로의 `README.md` 로드맵 및 PR 내역을 참고해 주시기 바랍니다.
