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
