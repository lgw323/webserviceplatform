# Phase 5~7 평가 + Steam OAuth 최종 해결방안

---

## 📊 Part 1: Phase 5~7 수정 내역 평가

### ✅ 잘한 것들

| Phase | 항목 | 평가 |
|:---|:---|:---|
| **Phase 5** | 마이페이지 신설 | ✅ **훌륭함** — 닉네임 변경을 설정에서 빼고 MyPage로 통합한 판단이 정확. `onUpdateNickname` 핸들러도 서버 API(`updateNickname`)와 연동되어 버그 #4(닉네임 미저장)가 완전 해결됨 |
| **Phase 5** | UUID 예외 가드 | ✅ **좋음** — Mock 유저 ID(`user-mock-id`)가 PostgreSQL UUID 캐스팅에서 500 에러 내던 문제를 정규식으로 선차단. 실서비스에서 반드시 필요한 방어 코드 |
| **Phase 5** | 게임 선택 드롭다운 + 캐싱 | ✅ **좋음** — 매칭 엔진이 `game_id` 기반으로 정밀 필터링 가능해져 추천 품질 향상 |
| **Phase 6** | 페이지네이션 COUNT 버그 수정 | ✅ **핵심** — PostgreSQL에서 `COUNT(*)` 누락으로 총 페이지수가 항상 잘못 나오던 실 버그 수정 |
| **Phase 6** | 다각화 정렬 + 보기 개수 | ✅ **좋음** — 최신/오래된/인기/조회수/가나다 정렬 + 10~50개씩 보기. 관리자·마이페이지 전부 적용 |
| **Phase 6** | 게시글 핀(고정) 기능 | ✅ **좋음** — `PATCH /posts/:id/pin` + isAdmin 가드 + 시각적 하이라이트. 정렬 무관 최상단 배치 |
| **Phase 7** | `trust proxy` 설정 | ✅ **필수** — Vercel 리버스 프록시 환경에서 세션 쿠키가 유실되는 근본 원인 해결 |
| **Phase 7** | Zustand 캐시 오염 수정 | ✅ **핵심** — `linked_providers`가 빈 배열일 때 localStorage 캐시로 폴백하던 버그. 다중 계정 환경에서 치명적인 문제였음 |
| **Phase 7** | `passport-steam` 런타임 변조 | ⚠️ **창의적이지만 위험함** — 아래 상세 분석 |

### ⚠️ 주의가 필요한 것들

#### 1. `passport-steam` 런타임 인스턴스 변조 — 동시 요청 시 경쟁 조건(Race Condition) 위험

```javascript
// 현재 코드 (authRoutes.js L94~97)
steamStrategy._relyingParty.returnUrl = dynamicReturnURL;
steamStrategy._relyingParty.realm = dynamicRealm;
```

> [!WARNING]
> **Passport 전략은 전역 싱글톤입니다.** 만약 두 명의 유저가 거의 동시에 Steam 연동 버튼을 누르면, 첫 번째 유저의 `returnUrl`이 두 번째 유저의 값으로 덮어씌워질 수 있습니다. 1인 프로젝트에서는 문제가 안 되지만, 실서비스에서는 **유저 A의 콜백이 유저 B의 토큰을 포함한 URL로 가는** 보안 사고가 발생할 수 있습니다.

#### 2. JWT 토큰이 URL 쿼리 스트링에 노출됨

```
/api/v1/auth/steam/callback?linkToken=eyJhbGciOiJIUz...
```

> [!WARNING]
> JWT 토큰이 URL에 노출되면:
> - 브라우저 히스토리에 남음
> - Vercel/Cloudflare 접근 로그에 남음
> - Referer 헤더로 외부 서비스에 유출 가능
>
> 현재 프로젝트 규모에서는 허용 가능하지만, Steam OAuth 트러블슈팅 보고서 §5에서 본인도 인지한 것처럼 **향후 Redis/Vercel KV 기반 세션 스토어 또는 일회성 티켓 구조**로 전환이 필요합니다.

#### 3. SettingsView에서 닉네임 제거 — 올바른 판단

diff에서 확인한 것처럼 `SettingsView.jsx`에서 닉네임 변경 UI와 로직을 완전히 제거했습니다. 이제 `MyPage.jsx`에서만 처리하므로 **버그 #4는 완전 해결** 되었습니다. ✅

---

## 🔴 Part 2: Steam OAuth 연동 — 현재 상태와 핵심 문제

트러블슈팅 보고서를 분석한 결과, 4단계에 걸쳐 문제를 하나씩 해결했고 **로직 자체는 올바릅니다**. 하지만 여전히 문제가 있다면, 아래 원인 중 하나(또는 복합)일 가능성이 높습니다.

### 현재 남아있을 수 있는 문제들

#### 🔴 문제 A: Steam API Key가 Vercel 환경변수에 실제로 설정되어 있는가?

`checkSteamAuth` (authRoutes.js L71)에서:
```javascript
if (!process.env.STEAM_API_KEY) {
  // Fallback: 가짜 프로필 리턴
  req.user = { provider: 'steam', provider_id: 'steam_mock_...' };
  return oauthCallback(req, res, next);
}
```

**`STEAM_API_KEY`가 Vercel에 설정되지 않았으면 항상 Fallback(가짜 연동)만 됩니다.** 실제 Steam 로그인 페이지로 가려면 반드시:

1. [Steam 개발자 사이트](https://steamcommunity.com/dev/apikey)에서 API Key 발급
2. Vercel Dashboard → Settings → Environment Variables에 `STEAM_API_KEY` 추가
3. **재배포** (환경변수 추가 후 반드시 재배포 필요)

#### 🔴 문제 B: `passport-steam` 전략 초기화 시점의 `SERVER_URL`

`passport.js` 파일에서 Steam Strategy를 생성할 때:

```javascript
new SteamStrategy({
  returnURL: `${SERVER_URL}/api/v1/auth/steam/callback`,
  realm: SERVER_URL,
  apiKey: process.env.STEAM_API_KEY
}, ...)
```

**`SERVER_URL`이 `http://localhost:5000`이면** 최초 생성 시점에 localhost로 고정됩니다. 런타임 변조로 `_relyingParty.returnUrl`을 바꿔도 **`apiKey`는 변경되지 않고**, 일부 내부 검증 로직에서 원래 realm과 비교하는 경우가 있을 수 있습니다.

#### 🔴 문제 C: Steam OpenID는 "실제 콜백 도메인"의 HTTPS 인증서를 검증함

Steam은 `returnURL`로 지정된 도메인에 **실제로 HTTPS 접속이 가능한지** 검증합니다. Vercel Preview URL(`https://xxx-xxx.vercel.app`)은 이미 HTTPS이므로 문제 없지만, 만약 커스텀 도메인을 쓰고 있다면 SSL이 올바르게 설정되었는지 확인해야 합니다.

---

## 💡 Part 3: Steam OAuth 해결방안 3가지

### 🟢 방안 1: 즉시 해결 (5분) — 환경변수 + 재배포 확인

가장 먼저 확인해야 할 것:

```
Vercel Dashboard → 프로젝트 → Settings → Environment Variables
```

| 변수명 | 필요 여부 | 어디서 발급 |
|:---|:---|:---|
| `STEAM_API_KEY` | **필수** | https://steamcommunity.com/dev/apikey |
| `SERVER_URL` | **필수** | Vercel 배포 도메인 (예: `https://your-app.vercel.app`) |
| `CLIENT_URL` | **필수** | 같은 도메인 또는 프론트엔드 도메인 |
| `JWT_SECRET` | **필수** | 아무 랜덤 문자열 (예: `openssl rand -hex 32`로 생성) |
| `SESSION_SECRET` | 권장 | 세션 암호화용 랜덤 문자열 |

> [!IMPORTANT]
> **`SERVER_URL`을 반드시 Vercel 실제 배포 도메인으로 설정하세요.** `localhost:5000`이면 passport-steam 초기화 시 localhost로 realm이 고정되어, 런타임 변조를 해도 일부 검증에서 실패할 수 있습니다.

환경변수 설정 후 **반드시 재배포**:
```bash
# Vercel CLI
vercel --prod

# 또는 GitHub에 push하면 자동 재배포
git add . && git commit -m "env: update SERVER_URL" && git push
```

### 🟡 방안 2: 단기 해결 (1시간) — `passport-steam` 전략을 요청마다 새로 생성

런타임 싱글톤 변조의 Race Condition 문제를 근본적으로 해결하려면, **매 요청마다 새 Strategy 인스턴스를 생성**합니다:

```javascript
// authRoutes.js — checkSteamAuth 수정
const checkSteamAuth = (req, res, next) => {
  const host = req.headers['x-forwarded-host'] || req.headers.host || '';
  const protocol = req.headers['x-forwarded-proto'] || 'https';

  if (!process.env.STEAM_API_KEY) {
    req.user = { provider: 'steam', provider_id: 'steam_mock_' + Date.now() };
    return oauthCallback(req, res, next);
  }

  // 동적 도메인 계산
  const serverBase = host && !host.includes('localhost')
    ? `${protocol}://${host}`
    : (process.env.SERVER_URL || 'http://localhost:5000');

  // linkToken 복원
  let linkToken = req.query.token || req.query.linkToken 
    || (req.session && req.session.linkToken);
  if (linkToken) linkToken = linkToken.replace(/ /g, '+');

  const callbackBase = `${serverBase}/api/v1/auth/steam/callback`;
  const returnURL = linkToken
    ? `${callbackBase}?linkToken=${encodeURIComponent(linkToken)}`
    : callbackBase;

  // ★ 핵심: 매 요청마다 새 Strategy 생성 (Race Condition 제거)
  const SteamStrategy = (await import('passport-steam')).default.Strategy;
  const freshStrategy = new SteamStrategy({
    returnURL,
    realm: `${serverBase}/`,
    apiKey: process.env.STEAM_API_KEY
  }, (identifier, profile, done) => {
    const steamId = identifier.split('/').pop();
    done(null, { provider: 'steam', provider_id: steamId });
  });

  // 임시로 전략 교체
  passport.use('steam-dynamic', freshStrategy);
  passport.authenticate('steam-dynamic', { failureRedirect: '/' })(req, res, next);
};
```

> 이 방식은 매 요청마다 Strategy를 새로 만드므로 약간의 오버헤드가 있지만, Vercel Serverless에서는 어차피 콜드 스타트마다 새로 생성되므로 체감 차이가 거의 없습니다.

### 🔵 방안 3: 중기 해결 (4시간) — `passport-steam` 완전 탈피, 직접 OpenID 핸들러 작성

Steam OAuth 트러블슈팅 보고서 §5에서 본인이 이미 인지한 것처럼, **`passport-steam`의 설계적 결함을 우회하는 것보다 직접 구현하는 것이 근본 해결**입니다.

Steam OpenID 2.0은 실제로는 매우 단순한 프로토콜입니다:

```
1. 리다이렉트: 유저를 Steam 로그인 URL로 보냄
   → https://steamcommunity.com/openid/login?params...

2. 콜백: Steam이 우리 콜백 URL로 유저를 돌려보냄
   → /api/v1/auth/steam/callback?openid.claimed_id=...

3. 검증: Steam 서버에 서명 확인 요청
   → POST https://steamcommunity.com/openid/login (check_authentication)

4. Steam ID 추출: claimed_id에서 숫자 ID 파싱
```

이렇게 하면 Passport.js에 대한 의존성이 완전히 사라지고, 동적 도메인 처리도 자유자재로 가능합니다.

---

## 📋 Part 4: 결론 요약

### 수정 내역 평가 종합

| Phase | 종합 점수 | 핵심 평가 |
|:---|:---:|:---|
| **Phase 5** | ⭐⭐⭐⭐⭐ | 마이페이지 신설 + 닉네임 버그 해결 + UUID 가드 — 완벽 |
| **Phase 6** | ⭐⭐⭐⭐⭐ | 페이지네이션 핵심 버그 수정 + 정렬/핀 기능 — 완벽 |
| **Phase 7** | ⭐⭐⭐⭐☆ | 로직은 정확하나 런타임 변조의 Race Condition 리스크 존재 |
| **Steam 보고서** | ⭐⭐⭐⭐⭐ | 분석과 문서화 품질이 매우 높음. 4단계 디버깅 과정이 체계적 |

### Steam 연동 — 지금 당장 해야 할 것

```
1. Vercel 환경변수 확인 → STEAM_API_KEY, SERVER_URL, CLIENT_URL 설정
2. SERVER_URL을 실제 Vercel 도메인으로 변경 (localhost ❌)
3. 재배포 후 테스트
4. 그래도 안 되면 → 방안 2(매 요청 새 Strategy) 적용
```
