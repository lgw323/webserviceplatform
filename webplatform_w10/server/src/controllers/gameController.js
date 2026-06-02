const STEAM_GAMES = [
  { id: 1, title: 'Cyberpunk 2077', playtime: 124, lastPlayed: '2 hours ago', platform: 'steam' },
  { id: 3, title: 'Elden Ring', playtime: 89, lastPlayed: '3 days ago', platform: 'steam' },
  { id: 4, title: 'The Witcher 3: Wild Hunt', playtime: 310, lastPlayed: '1 week ago', platform: 'steam' },
];

const RIOT_GAMES = [
  { id: 2, title: 'Valorant', playtime: 450, lastPlayed: 'Yesterday', platform: 'riot' },
];

export const getGameLibrary = (req, res) => {
  const providersParam = req.query.providers || '';
  const providers = providersParam ? providersParam.split(',').map(p => p.trim().toLowerCase()) : [];

  let games = [];

  if (providers.length === 0) {
    // No specific provider requested — return empty (shouldn't happen in normal flow)
    games = [];
  } else {
    if (providers.includes('steam')) {
      games = games.concat(STEAM_GAMES);
    }
    if (providers.includes('riot')) {
      games = games.concat(RIOT_GAMES);
    }
  }

  res.json({
    status: 'success',
    data: { games }
  });
};
