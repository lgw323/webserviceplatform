import axios from 'axios';

// ── Steam Web API 연동 서비스 ──
const STEAM_API_KEY = process.env.STEAM_API_KEY;
const STEAM_API_BASE_URL = 'http://api.steampowered.com';

/**
 * 주어진 Steam ID를 사용하여 유저의 보유 게임 및 플레이 시간 정보를 가져옵니다.
 * @param {string} steamId - 유저의 64비트 Steam ID
 * @returns {Promise<Array>} 게임 라이브러리 배열
 */
export const fetchSteamGames = async (steamId) => {
  if (!STEAM_API_KEY) {
    console.warn('⚠️ [Steam Service] STEAM_API_KEY가 없습니다. Mock 데이터를 사용합니다.');
    return getFallbackSteamGames();
  }

  // 간단한 유효성 검사 (Steam ID는 17자리 숫자)
  if (!/^\d{17}$/.test(steamId)) {
    console.warn(`⚠️ [Steam Service] 유효하지 않은 Steam ID 형식입니다 (${steamId}). Mock 데이터를 사용합니다.`);
    return getFallbackSteamGames();
  }

  try {
    const url = `${STEAM_API_BASE_URL}/IPlayerService/GetOwnedGames/v0001/`;
    const response = await axios.get(url, {
      params: {
        key: STEAM_API_KEY,
        steamid: steamId,
        include_appinfo: true,
        include_played_free_games: true,
        format: 'json'
      }
    });

    if (response.data && response.data.response && response.data.response.games) {
      return response.data.response.games.map(game => ({
        id: game.appid,
        title: game.name,
        // Steam API returns playtime in minutes, convert to hours
        playtime: Math.round(game.playtime_forever / 60),
        lastPlayed: '최근 플레이 (Steam 동기화)',
        platform: 'steam'
      })).sort((a, b) => b.playtime - a.playtime).slice(0, 50); // 상위 50개만
    }

    return getFallbackSteamGames();
  } catch (error) {
    console.error('🚨 [Steam Service] API 호출 중 오류 발생:', error.message);
    return getFallbackSteamGames();
  }
};

/**
 * Fallback Mock Data
 */
function getFallbackSteamGames() {
  return [
    { id: 1091500, title: 'Cyberpunk 2077', playtime: 124, lastPlayed: '2 hours ago', platform: 'steam' },
    { id: 1245620, title: 'Elden Ring', playtime: 89, lastPlayed: '3 days ago', platform: 'steam' },
    { id: 292030, title: 'The Witcher 3: Wild Hunt', playtime: 310, lastPlayed: '1 week ago', platform: 'steam' },
    { id: 570, title: 'Dota 2', playtime: 1540, lastPlayed: 'Yesterday', platform: 'steam' },
    { id: 730, title: 'Counter-Strike 2', playtime: 820, lastPlayed: '5 hours ago', platform: 'steam' }
  ];
}
