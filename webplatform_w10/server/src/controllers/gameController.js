export const getGameLibrary = (req, res) => {
  res.json({
    status: 'success',
    data: {
      games: [
        { id: 1, title: 'Cyberpunk 2077', playtime: 124, lastPlayed: '2 hours ago', platform: 'Steam' },
        { id: 2, title: 'Valorant', playtime: 450, lastPlayed: 'Yesterday', platform: 'Riot Games' },
        { id: 3, title: 'Elden Ring', playtime: 89, lastPlayed: '3 days ago', platform: 'Steam' },
        { id: 4, title: 'The Witcher 3: Wild Hunt', playtime: 310, lastPlayed: '1 week ago', platform: 'Steam' }
      ]
    }
  });
};
