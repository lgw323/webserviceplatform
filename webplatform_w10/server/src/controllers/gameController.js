import { fetchSteamGames } from '../services/steamService.js';

const RIOT_GAMES = [
  { id: 2, title: 'Valorant', playtime: 450, lastPlayed: 'Yesterday', platform: 'riot' },
  { id: 10, title: 'League of Legends', playtime: 1200, lastPlayed: '2 hours ago', platform: 'riot' }
];

export const getGameLibrary = async (req, res) => {
  try {
    const providersParam = req.query.providers || '';
    const providers = providersParam ? providersParam.split(',').map(p => p.trim().toLowerCase()) : [];

    // req.user는 authMiddleware에서 파싱되어 넘어옴
    const user = req.user || { provider_id: 'mock_id' }; 

    let games = [];

    if (providers.length === 0) {
      games = [];
    } else {
      if (providers.includes('steam')) {
        // 어드민 계정(admin@syncrig.com)은 개인정보 보호를 위해 항상 mock 데이터를 사용하도록 강제 설정
        const steamId = user.email === 'admin@syncrig.com'
          ? 'steam_mock_admin'
          : (user.provider === 'steam' ? user.provider_id : user.steam_id);
        const steamGames = await fetchSteamGames(steamId);
        games = games.concat(steamGames);
      }
      if (providers.includes('riot')) {
        games = games.concat(RIOT_GAMES);
      }
    }

    res.json({
      status: 'success',
      data: { games }
    });
  } catch (error) {
    console.error('[GameController] 오류:', error);
    res.status(500).json({ status: 'error', message: '게임 라이브러리를 동기화하는 중 오류가 발생했습니다.' });
  }
};
