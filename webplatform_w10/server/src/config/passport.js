import passport from 'passport';
import SteamStrategy from 'passport-steam';
import OAuth2Strategy from 'passport-oauth2';
import dotenv from 'dotenv';
import { db } from './db.js';

dotenv.config();

const SERVER_URL = process.env.SERVER_URL || 'http://localhost:5000';
const STEAM_API_KEY = process.env.STEAM_API_KEY;
const RIOT_CLIENT_ID = process.env.RIOT_CLIENT_ID;
const RIOT_CLIENT_SECRET = process.env.RIOT_CLIENT_SECRET;

// Passport 직렬화/역직렬화 (세션 사용 시 필요)
passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((obj, done) => {
  done(null, obj);
});

// ── 1. Steam 전략 설정 (OpenID 2.0) ──
if (STEAM_API_KEY) {
  passport.use(new SteamStrategy({
    returnURL: `${SERVER_URL}/api/v1/auth/steam/callback`,
    realm: SERVER_URL,
    apiKey: STEAM_API_KEY
  },
  async (identifier, profile, done) => {
    try {
      // identifier는 보통 'https://steamcommunity.com/openid/id/12345678901234567' 형식
      const steamId = identifier.match(/\d+$/)[0];
      
      const user = {
        provider: 'steam',
        provider_id: steamId,
        displayName: profile?.displayName || `SteamUser_${steamId}`
      };
      
      return done(null, user);
    } catch (err) {
      return done(err, null);
    }
  }));
} else {
  console.warn('⚠️ [Passport] STEAM_API_KEY가 없습니다. Steam 실제 인증이 비활성화됩니다.');
}

// ── 2. Riot 전략 설정 (OAuth 2.0) ──
if (RIOT_CLIENT_ID && RIOT_CLIENT_SECRET) {
  passport.use('riot', new OAuth2Strategy({
    authorizationURL: 'https://auth.riotgames.com/authorize',
    tokenURL: 'https://auth.riotgames.com/token',
    clientID: RIOT_CLIENT_ID,
    clientSecret: RIOT_CLIENT_SECRET,
    callbackURL: `${SERVER_URL}/api/v1/auth/riot/callback`
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      // 라이엇은 profile을 가져오려면 별도의 account API 호출이 필요할 수 있습니다.
      // 여기서는 성공적으로 토큰을 발급받았을 때 임시 ID를 생성하거나, 
      // 추가 API 호출 로직을 넣어야 합니다. (현재는 토큰만으로 가짜 ID 생성)
      // 실제 서비스에서는 Riot Account API (/riot/account/v1/accounts/me)를 호출하여 puuid를 획득해야 합니다.
      const riotUser = {
        provider: 'riot',
        provider_id: 'riot_mock_puuid_' + Math.floor(Math.random() * 1000000), // 임시
        accessToken
      };
      return done(null, riotUser);
    } catch (err) {
      return done(err, null);
    }
  }));
} else {
  console.warn('⚠️ [Passport] RIOT_CLIENT_ID가 없습니다. Riot 실제 인증이 비활성화됩니다.');
}

export default passport;
