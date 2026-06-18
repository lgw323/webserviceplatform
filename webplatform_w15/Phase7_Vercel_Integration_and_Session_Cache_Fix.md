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
