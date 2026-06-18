# Phase 7: Vercel Preview 동적 리다이렉션 및 세션 캐시 오염 버그 해결
*SYNCRIG 플랫폼 — 15주차 추가 검증 및 개선 산출물*

> **목적:** Vercel 배포 환경(특히 Preview 및 Production)에서 발생할 수 있는 스팀/라이엇 연동 리다이렉션 및 세션 쿠키 미유지 오류를 해결하고, 회원가입/로그인 시 이전 사용자의 스팀 연동 기록이 신규 계정으로 잘못 전이되던 로컬 세션 캐시 오염 버그를 완벽하게 정상화했습니다.

---

## 1. 주요 개선 및 추가 기능 상세

### 1.1. Vercel Preview 대응 동적 OAuth 리다이렉션 구현
- **문제 배경**: Vercel 배포 시, 개발 서버나 메인 운영 도메인(localhost:3000, production)으로 콜백 URL 및 클라이언트 주소가 하드코딩되어 있으면, Vercel Preview 도메인에서 스팀 연동 버튼 클릭 시 다른 도메인으로 튀거나 리다이렉트가 오작동하는 현상이 발생했습니다.
- **해결 방안 (`x-forwarded-host` 감지)**:
  - 백엔드 라우터 및 컨트롤러에서 `req.headers['x-forwarded-host']` 및 `req.headers['x-forwarded-proto']`를 분석하여 사용자가 현재 머무르고 있는 Vercel Preview의 동적 도메인을 실시간으로 추론합니다.
  - 이를 기반으로 스팀의 `returnURL` 및 OpenID `realm`, 그리고 라이엇의 `callbackURL` 연동 주소를 실시간 동적으로 매핑하여 넘기도록 수정했습니다. (Steam OpenID 규격 상 `returnURL`은 `realm` 도메인의 하위 경로여야 하므로 둘 다 동적으로 매칭해야 리다이렉션 오류가 발생하지 않습니다. 특히, `passport-openid` / `passport-steam` 라이브러리는 `passport.authenticate('steam', { returnURL, realm })` 호출 시 인자로 받은 옵션을 런타임에 완전히 무시하고 생성 시점의 값만 사용하는 설계적 한계가 있어, 미들웨어 호출 직전에 Passport 글로벌 싱글톤 내 등록된 `steamStrategy._relyingParty` 인스턴스의 프로퍼티 값을 동적으로 직접 변경(Runtime Mutation)하여 무결성을 보장하도록 해결하였습니다.)
  - **Stateless 토큰 추적 (Vercel Serverless 대응)**: Vercel의 Serverless Functions 환경은 서버 인스턴스가 무작위로 뜨고 꺼지는 **무상태성(Stateless)** 구조이기 때문에, `express-session` 내부 메모리 세션 방식(`req.session.linkToken`)을 사용하면 스팀 페이지를 다녀왔을 때 세션 데이터가 100% 유실됩니다. 이로 인해 연동 모드임이 감지되지 않아 연동 처리가 무시되고 신규 임시 계정으로 강제 로그인되던 버그를 고쳤습니다.
  - 스팀의 경우 인증 후 되돌아올 `returnURL` 뒤에 `?linkToken=JWT_TOKEN` 쿼리 스트링을 직접 덧붙여 스팀이 인증 완료 시 이 토큰 주소를 그대로 달고 복귀하도록 하고, 라이엇의 경우 OAuth 2.0 규격의 `state` 파라미터에 JWT 토큰을 담아 돌려받음으로써 세션 서버 없이도 완벽하고 안전하게 계정 연동 context를 보존 및 성공하도록 수정했습니다.
  - **JWT 인코딩 및 서명 변조 방지**: JWT 토큰을 URL의 쿼리 스트링으로 실어 보낼 때 문자 분실이나 형식이 깨지지 않도록 `encodeURIComponent`로 감싸서 전달하였고, 웹 서버 쿼리 파서가 Base64 서명 속의 플러스(`+`) 문자를 공백(space)으로 디코딩하는 문제를 막기 위해 토큰을 검증하기 직전 공백을 다시 `+`로 치환하는 전처리 핸들러를 장착하여 인증 오류를 방지했습니다.
  - **클라이언트 콜백 동기화 고도화**: 스팀에서 프론트엔드 콜백 페이지([`AuthCallback.jsx`](file:///c:/Users/dlrjs/Desktop/webserviceplatform/webplatform_w10/client/src/pages/AuthCallback.jsx))로 복귀 시, 새 토큰을 로컬스토리지에 저장한 뒤 Zustand 스토어 갱신 없이 즉시 홈(`/`)으로 이동하여 브라우저를 수동으로 새로고침(F5)하기 전에는 연동 뱃지가 갱신되지 않던 문제를 해결하기 위해, 네비게이션 직전 `useAuthStore.getState().initialize()`를 명시적으로 실행하여 화면 상에 실시간으로 연동 정보가 반영되도록 수정했습니다.
  - 로그인/연동 성공 후 프론트엔드로 리다이렉션될 때도, 세션에 보관된 `redirectOrigin`이나 실시간 추론된 호스트를 기준으로 최종 복귀할 클라이언트 URL (`CLIENT_URL`)을 동적으로 구성하여 Vercel Preview 환경에서 로그인 흐름이 완벽히 이어지도록 했습니다.

### 1.2. 리버스 프록시 뒤 Express 세션 쿠키 유지 보장
- **문제 배경**: 보안 통신을 위한 `cookie.secure = true` 옵션이 켜져 있을 때, Vercel과 같은 리버스 프록시 뒤에서 작동하는 Express 서버는 프록시 헤더를 신뢰하지 않아 세션 쿠키 발급 및 복구가 불가능해지고 스팀 연동 프로세스 진입이 차단되는 현상이 있었습니다.
- **해결 방안 (`trust proxy` 적용)**:
  - `server.js` 파일 상단에 `app.set('trust proxy', 1)`을 선언하여, 리버스 프록시 환경에서도 세션 쿠키가 클라이언트와 백엔드 간에 끊김 없이 안전하게 교환되도록 보장했습니다.

### 1.3. 회원가입/로그인 시 이전 세션 연동 정보 전이(오염) 버그 해결
- **문제 배경**: 이메일 가입 후 새로고침하거나 신규 계정으로 로그인했을 때, 스팀 연동을 하지 않았음에도 화면에 스팀 연동 완료 상태가 뜨는 현상이 있었습니다.
- **원인 분석 (Zustand useAuthStore 캐싱 오류)**:
  - 유저 세션을 초기화할 때 백엔드 JWT 토큰에서 제공한 `linked_providers` 정보를 사용하되, 만약 배열이 비어있으면 브라우저 `localStorage`에 남아있던 캐시 데이터 (`syncrig_linked_providers`)로 자동 폴백되는 버그가 있었습니다.
  - 이로 인해 한 컴퓨터(브라우저)에서 스팀을 연동한 뒤 다른 계정으로 다시 회원가입하거나 로그인했을 때, 이전 사용자의 스팀 연동 데이터가 브라우저 캐시에서 그대로 로드되어 신규 유저 계정을 오염시켰습니다.
- **해결 방안 (JWT 기반 무결성 보장)**:
  - [useAuthStore.js](file:///c:/Users/dlrjs/Desktop/webserviceplatform/webplatform_w10/client/src/store/useAuthStore.js)의 `initialize` 시점에 빈 연동 정보가 올 때 로컬 저장소 캐시로 폴백하지 않고, 백엔드 JWT 페이로드에 포함된 유저 연동 정보를 있는 그대로 신뢰하도록 로직을 수정했습니다.
  - 세션 초기화 성공 시 로컬 저장소도 해당 신규 연동 정보로 덮어씌워 완전히 동기화함으로써 다중 계정 전환 환경에서도 완벽한 데이터 정합성을 유지하도록 보장했습니다.

---

## 2. API 및 라우트 갱신 현황 (Phase 7)

### 2.1. 동적 OAuth 및 세션 설정
- `server.js`: `app.set('trust proxy', 1)` 설정 추가.
- `authRoutes.js`: `checkSteamAuth` 및 `checkRiotAuth` 미들웨어 내에서 `x-forwarded-host` 헤더를 기반으로 `returnURL`/`callbackURL` 및 `realm` 동적 생성 로직 탑재.
- `authController.js`: `oauthCallback` 메소드 내에서 세션 `redirectOrigin` 및 프록시 헤더를 기반으로 최종 `CLIENT_URL`을 동적으로 구성하여 안전한 리다이렉트 수행.

---

## 3. 관련 소스코드 파일 변경 목록

### 3.1. 백엔드 (Server API)
- [MODIFY] [`server.js`](file:///c:/Users/dlrjs/Desktop/webserviceplatform/webplatform_w10/server/server.js): Express 프록시 신뢰 설정 추가.
- [MODIFY] [`authRoutes.js`](file:///c:/Users/dlrjs/Desktop/webserviceplatform/webplatform_w10/server/src/routes/authRoutes.js): 콜백/리턴 URL의 동적 세팅 로직 추가.
- [MODIFY] [`authController.js`](file:///c:/Users/dlrjs/Desktop/webserviceplatform/webplatform_w10/server/src/controllers/authController.js): OAuth 완료 리다이렉션 목적지 도메인의 동적 연산 지원.

### 3.2. 프론트엔드 (Client Application)
- [MODIFY] [`useAuthStore.js`](file:///c:/Users/dlrjs/Desktop/webserviceplatform/webplatform_w10/client/src/store/useAuthStore.js): 다중 계정 로그인/회원가입 시 연동 정보 캐시 오염을 막기 위해 초기화 흐름 전면 수정.

---

## 4. Phase 7 추가 업데이트: 대시보드 차트 동적화, 최적화 허브 매칭 정상화 및 UI 결함 해소

> **목적:** 대시보드의 플레이 시간 통계 차트가 고정 요일이 아닌 현재 날짜 기준으로 유동적으로 표시되도록 개선하고, 최적화 허브에서 게임별 추천 프로필이 조회되지 않던 근본 원인(DB 쿼리 오류 + 시드 데이터 부재)을 해결하며, 프로필 상세 보기 모달의 무한 좋아요 결함을 수정합니다.

### 4.1. 대시보드 플레이 시간 통계 차트 동적화 및 한글 레이블 적용
- **문제 배경**: 기존 차트는 `Mon`~`Sun`까지 고정된 영어 요일 레이블을 사용하여, 오늘이 무슨 요일인지에 관계없이 항상 동일한 순서(월~일)로만 표시되었습니다. 웹 애플리케이션의 UI 언어가 한국어임에도 차트 레이블만 영어로 표기되는 불일치도 존재했습니다.
- **해결 방안 (동적 7일 윈도우 + 한글화)**:
  - [`DashboardCharts.jsx`](file:///c:/Users/dlrjs/Desktop/webserviceplatform/webplatform_w10/client/src/features/dashboard/DashboardCharts.jsx)의 `generateWeeklyFromGames()` 함수를 전면 리팩토링하여, 사용자의 클라이언트 시계(`new Date()`)를 기준으로 최근 7일을 동적으로 역산합니다.
  - 가장 오른쪽 차트 막대가 항상 **오늘**에 해당하는 요일이 되며, 왼쪽으로 갈수록 과거 날짜의 요일이 표시됩니다.
  - 모든 요일 레이블을 한글(**월, 화, 수, 목, 금, 토, 일**)로 통일하여 웹 설정의 언어 톤과 일치시켰습니다.
  - 주말(토/일)에 더 높은 플레이 시간 가중치가 부여되는 시뮬레이션 로직이 실제 요일 인덱스(`Date.prototype.getDay()`)에 정확히 매핑되도록 가중치 배열을 재정렬했습니다.

### 4.2. 최적화 허브 추천 프로필 매칭 정상화 (PostgreSQL 캐스팅 에러 + 시드 데이터 보강)
- **문제 배경**: 최적화 허브 페이지에서 게임을 선택해도 "하드웨어와 일치하는 프로필이 없습니다"라는 빈 결과만 표시되던 문제가 있었습니다. 원인은 두 가지였습니다.
  1. **PostgreSQL UUID 캐스팅 에러**: 게임 라이브러리에 포함된 Riot 게임(`'valorant'`, `'lol'`) 또는 Steam의 숫자형 App ID(`'1091500'` 등)는 UUID 형식이 아닌데, 백엔드 추천 컨트롤러에서 이 값을 UUID 타입인 `optimization_profiles.game_id` 컬럼과 직접 비교하여 `invalid input syntax for type uuid` 예외가 발생했습니다. 이로 인해 API가 500 에러를 반환하고 프론트엔드가 빈 결과를 표시했습니다.
  2. **시드 데이터 부재**: 기존 Mock DB 시딩 로직에서 최적화 프로필을 랜덤 게임에만 1~3개씩 할당했기 때문에, 특정 게임·하드웨어 조합에 매칭될 프로필 자체가 아예 존재하지 않는 경우가 빈번했습니다.
- **해결 방안**:
  - [`recommendationController.js`](file:///c:/Users/dlrjs/Desktop/webserviceplatform/webplatform_w10/server/src/controllers/recommendationController.js)에서 `game_id` 파라미터가 UUID 형식인지 정규식으로 사전 검증합니다. UUID가 아닌 경우 `games.external_app_id`(VARCHAR 컬럼)만으로 필터링하여 PostgreSQL 타입 변환 에러를 원천 방지했습니다.
  - [`mockDb.js`](file:///c:/Users/dlrjs/Desktop/webserviceplatform/webplatform_w10/server/src/config/mockDb.js)에 **모든 게임(9종) × 모든 하드웨어 등급(5티어) = 45개의 기준 최적화 프로필**을 추가 시딩하여, 어떤 게임·사양 조합을 선택하더라도 매칭 엔진이 반드시 유사도 높은 추천 결과를 반환하도록 보장했습니다.

### 4.3. 최적화 허브 프로필 상세 보기 무한 좋아요 버그 해결
- **문제 배경**: 추천 프로필의 상세 보기 모달에서 "도움됨" 또는 "작동 안함" 피드백 버튼을 클릭한 후 모달을 닫고 다시 열면, 피드백 상태가 초기화되어 같은 프로필에 무한히 좋아요/싫어요를 반복할 수 있는 결함이 있었습니다.
- **원인 분석**: 모달을 닫는 `closeModal()` 콜백에서 `setFeedbackGiven(null)`로 피드백 상태를 강제 초기화하고 있었기 때문입니다. 피드백 상태가 단일 문자열(`feedbackGiven`)이었기 때문에 모달을 닫으면 모든 프로필에 대한 피드백 이력이 소멸되었습니다.
- **해결 방안**:
  - [`RecommendationList.jsx`](file:///c:/Users/dlrjs/Desktop/webserviceplatform/webplatform_w10/client/src/components/RecommendationList.jsx)에서 단일 `feedbackGiven` 상태를 **프로필 ID 기반 맵 객체(`feedbacks: { [profileId]: 'helpful' | 'not_working' }`)**로 리팩토링하여, 각 프로필별로 피드백 이력을 독립적으로 관리합니다.
  - 모달을 닫을 때 피드백 상태를 초기화하지 않도록 `closeModal()`에서 `setFeedbackGiven(null)` 호출을 제거했습니다.
  - 한 번 피드백을 남긴 프로필 카드는 모달을 열고 닫더라도 "도움됨"/"작동 안함" 버튼이 비활성화 상태로 유지되어 **중복 투표가 완벽하게 차단**됩니다.

---

## 5. Phase 7 추가 업데이트 관련 소스코드 파일 변경 목록

### 5.1. 백엔드 (Server API)
- [MODIFY] [`recommendationController.js`](file:///c:/Users/dlrjs/Desktop/webserviceplatform/webplatform_w10/server/src/controllers/recommendationController.js): 비-UUID 게임 ID 조회 시 PostgreSQL 캐스팅 에러를 방지하기 위한 UUID 포맷 사전 검증 분기 추가.
- [MODIFY] [`mockDb.js`](file:///c:/Users/dlrjs/Desktop/webserviceplatform/webplatform_w10/server/src/config/mockDb.js): 전 게임·전 하드웨어 등급별 기준 최적화 프로필 45건 추가 시딩.

### 5.2. 프론트엔드 (Client Application)
- [MODIFY] [`DashboardCharts.jsx`](file:///c:/Users/dlrjs/Desktop/webserviceplatform/webplatform_w10/client/src/features/dashboard/DashboardCharts.jsx): 플레이 시간 통계 차트의 요일 계산을 현재 날짜 기준 최근 7일로 동적 전환, 요일 레이블 한글화.
- [MODIFY] [`RecommendationList.jsx`](file:///c:/Users/dlrjs/Desktop/webserviceplatform/webplatform_w10/client/src/components/RecommendationList.jsx): 프로필 ID 기반 피드백 상태 관리로 리팩토링하여 무한 좋아요 버그 해결.

