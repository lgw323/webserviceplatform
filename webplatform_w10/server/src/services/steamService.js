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
  const isRealSteamId = /^\d{17}$/.test(steamId);

  // 만약 실제 17자리 스팀 ID가 아니라면(테스트용 mock 유저 등), mock 데이터를 그대로 노출합니다.
  if (!isRealSteamId) {
    console.log(`ℹ️ [Steam Service] Mock 유저 ID 감지 (${steamId}). Mock 데이터를 노출합니다.`);
    return getFallbackSteamGames();
  }

  // 실제 스팀 ID인데 API Key가 없다면 빈 배열 반환
  if (!STEAM_API_KEY) {
    console.warn('⚠️ [Steam Service] STEAM_API_KEY가 등록되지 않아 실제 스팀 연동 게임을 조회할 수 없습니다. 빈 배열을 반환합니다.');
    return [];
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
      const allGames = response.data.response.games.map(game => ({
        id: game.appid,
        title: game.name,
        // Steam API returns playtime in minutes, convert to hours
        playtime: Math.round(game.playtime_forever / 60),
        lastPlayed: '최근 플레이 (Steam 동기화)',
        platform: 'steam',
        achievementsCount: 0
      })).sort((a, b) => b.playtime - a.playtime);

      // 상위 10개 게임에 대해 실제 달성 과제 조회 (병렬 처리)
      const topGames = allGames.slice(0, 10);
      await Promise.all(topGames.map(async (game) => {
        try {
          const achievementsUrl = `${STEAM_API_BASE_URL}/ISteamUserStats/GetPlayerAchievements/v0001/`;
          const achResponse = await axios.get(achievementsUrl, {
            params: {
              key: STEAM_API_KEY,
              steamid: steamId,
              appid: game.id,
              format: 'json'
            }
          });
          if (achResponse.data && achResponse.data.playerstats && achResponse.data.playerstats.achievements) {
            const unlockedCount = achResponse.data.playerstats.achievements.filter(ach => ach.achieved === 1).length;
            game.achievementsCount = unlockedCount;
          }
        } catch (err) {
          // 달성 과제가 없거나 프로필 비공개 등으로 오류 발생 시 0개 유지
          console.warn(`[Steam Service] 게임 ID ${game.id} (${game.title})의 달성 과제 조회 실패:`, err.message);
        }
      }));

      return allGames.slice(0, 50); // 상위 50개만
    }

    // 실제 사용자의 프로필이 비공개이거나 보유 게임이 없는 경우 빈 배열 반환
    console.warn(`⚠️ [Steam Service] 스팀 ID ${steamId}의 프로필이 비공개이거나 게임을 찾을 수 없습니다.`);
    return [];
  } catch (error) {
    console.error('🚨 [Steam Service] API 호출 중 오류 발생:', error.message);
    return [];
  }
};

/**
 * Fallback Mock Data
 */
function getFallbackSteamGames() {
  return [
    { id: 1091500, title: 'Cyberpunk 2077', playtime: 124, lastPlayed: '2 hours ago', platform: 'steam', achievementsCount: 34 },
    { id: 1245620, title: 'Elden Ring', playtime: 89, lastPlayed: '3 days ago', platform: 'steam', achievementsCount: 22 },
    { id: 292030, title: 'The Witcher 3: Wild Hunt', playtime: 310, lastPlayed: '1 week ago', platform: 'steam', achievementsCount: 52 },
    { id: 570, title: 'Dota 2', playtime: 1540, lastPlayed: 'Yesterday', platform: 'steam', achievementsCount: 88 },
    { id: 730, title: 'Counter-Strike 2', playtime: 820, lastPlayed: '5 hours ago', platform: 'steam', achievementsCount: 1 }
  ];
}
