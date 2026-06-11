import crypto from 'crypto';

const baseDate = new Date();
const pastDate = (daysAgo) => new Date(baseDate.getTime() - daysAgo * 24 * 60 * 60 * 1000);

export const MOCK_DB = {
  users: [],
  email_verification_codes: [],
  hardware_profiles: [],
  posts: [],
  comments: [],
  games: [
    { id: 'game_cyberpunk', external_app_id: '1091500', title: 'Cyberpunk 2077', created_at: pastDate(30) },
    { id: 'game_valorant', external_app_id: 'valorant', title: 'Valorant', created_at: pastDate(30) },
    { id: 'game_elden', external_app_id: '1245620', title: 'Elden Ring', created_at: pastDate(30) },
    { id: 'game_witcher3', external_app_id: '292030', title: 'The Witcher 3: Wild Hunt', created_at: pastDate(30) },
    { id: 'game_bg3', external_app_id: '1086940', title: 'Baldur\'s Gate 3', created_at: pastDate(25) },
    { id: 'game_palworld', external_app_id: '1623730', title: 'Palworld', created_at: pastDate(20) },
    { id: 'game_wukong', external_app_id: '2358720', title: 'Black Myth: Wukong', created_at: pastDate(10) }
  ],
  optimization_profiles: []
};

const tiers = [
  {
    tierName: '하이엔드',
    count: 5,
    cpu: ['Intel Core i9-14900K', 'AMD Ryzen 9 7950X3D', 'Intel Core i9-13900K'],
    gpu: ['NVIDIA GeForce RTX 4090', 'AMD Radeon RX 7900 XTX'],
    ram: [64, 32],
    res: '4K'
  },
  {
    tierName: '상위',
    count: 8,
    cpu: ['Intel Core i7-13700K', 'AMD Ryzen 7 7800X3D', 'Intel Core i5-13600K'],
    gpu: ['NVIDIA GeForce RTX 4080', 'NVIDIA GeForce RTX 4070 Ti SUPER', 'AMD Radeon RX 7900 XT'],
    ram: [32],
    res: 'QHD'
  },
  {
    tierName: '미드레인지',
    count: 10,
    cpu: ['AMD Ryzen 5 5600X', 'Intel Core i5-12400F', 'AMD Ryzen 5 7600X'],
    gpu: ['NVIDIA GeForce RTX 3060', 'NVIDIA GeForce RTX 4060', 'AMD Radeon RX 6700 XT'],
    ram: [16],
    res: 'FHD'
  },
  {
    tierName: '보급형',
    count: 5,
    cpu: ['Intel Core i3-12100F', 'AMD Ryzen 5 3600'],
    gpu: ['NVIDIA GeForce GTX 1660 SUPER', 'NVIDIA GeForce RTX 3050'],
    ram: [16, 8],
    res: 'FHD'
  },
  {
    tierName: '초보급형',
    count: 2,
    cpu: ['AMD Ryzen 3 3100', 'Intel Core i5-10400F'],
    gpu: ['NVIDIA GeForce GTX 1050 Ti', 'AMD Radeon RX 570'],
    ram: [8],
    res: 'HD'
  }
];

const mockUsers = [];
const mockHwProfiles = [];
const mockOptProfiles = [];

let userIndex = 1;

for (const tier of tiers) {
  for (let i = 0; i < tier.count; i++) {
    const userId = `user-mock-${userIndex}`;
    const email = `mockuser${userIndex}@example.com`;
    
    mockUsers.push({
      id: userId,
      email,
      nickname: `Gamer${userIndex}_${tier.tierName}`,
      provider: 'local',
      provider_id: email,
      password_hash: 'mock_hash',
      email_verified: true,
      role: 'user',
      linked_providers: ['steam'],
      subscription_status: i % 3 === 0 ? 'premium' : 'free',
      toss_payment_key: null,
      created_at: pastDate(Math.floor(Math.random() * 60))
    });

    const hwId = `hw-mock-${userIndex}`;
    const hwCpu = tier.cpu[Math.floor(Math.random() * tier.cpu.length)];
    const hwGpu = tier.gpu[Math.floor(Math.random() * tier.gpu.length)];
    const hwRam = tier.ram[Math.floor(Math.random() * tier.ram.length)];
    
    mockHwProfiles.push({
      id: hwId,
      user_id: userId,
      is_default: true,
      cpu_model: hwCpu,
      gpu_model: hwGpu,
      ram_gb: hwRam,
      resolution: tier.res,
      refresh_rate: tier.res === '4K' ? 144 : tier.res === 'HD' ? 60 : 165,
      created_at: pastDate(Math.floor(Math.random() * 30))
    });

    // Create 1-3 optimization profiles for each user
    const numGames = Math.floor(Math.random() * 3) + 1;
    for (let j = 0; j < numGames; j++) {
      const game = MOCK_DB.games[Math.floor(Math.random() * MOCK_DB.games.length)];
      
      let fpsBase = 60;
      let settings = { 'Texture Quality': 'Medium', 'Shadows': 'Medium' };
      
      if (tier.tierName === '하이엔드') {
        fpsBase = Math.floor(Math.random() * 40) + 100; // 100-140
        settings = { 'Texture Quality': 'Ultra', 'Ray Tracing': 'Ultra', 'Shadows': 'High', 'DLSS': 'Quality' };
      } else if (tier.tierName === '상위') {
        fpsBase = Math.floor(Math.random() * 30) + 80; // 80-110
        settings = { 'Texture Quality': 'High', 'Ray Tracing': 'Medium', 'Shadows': 'High', 'DLSS': 'Balanced' };
      } else if (tier.tierName === '미드레인지') {
        fpsBase = Math.floor(Math.random() * 30) + 60; // 60-90
        settings = { 'Texture Quality': 'High', 'Ray Tracing': 'Off', 'Shadows': 'Medium', 'DLSS': 'Performance' };
      } else if (tier.tierName === '보급형') {
        fpsBase = Math.floor(Math.random() * 20) + 50; // 50-70
        settings = { 'Texture Quality': 'Medium', 'Ray Tracing': 'Off', 'Shadows': 'Low', 'FSR': 'Performance' };
      } else {
        fpsBase = Math.floor(Math.random() * 15) + 30; // 30-45
        settings = { 'Texture Quality': 'Low', 'Ray Tracing': 'Off', 'Shadows': 'Low', 'Resolution Scale': '70%' };
      }

      mockOptProfiles.push({
        id: `opt-mock-${userIndex}-${j}`,
        user_id: userId,
        game_id: game.id,
        hardware_id: hwId,
        hardware: { cpu_model: hwCpu, gpu_model: hwGpu, ram_gb: hwRam, resolution: tier.res },
        settings_json: settings,
        avg_fps: fpsBase + Math.random() * 5,
        game_version: 'Latest',
        likes: Math.floor(Math.random() * 150),
        created_at: pastDate(Math.floor(Math.random() * 20))
      });
    }

    userIndex++;
  }
}

// Add an explicit admin user
mockUsers.push({
  id: 'user-admin-1',
  email: 'admin@syncrig.com',
  nickname: 'AdminUser',
  provider: 'local',
  provider_id: 'admin@syncrig.com',
  password_hash: 'mock_hash',
  email_verified: true,
  role: 'admin',
  linked_providers: [],
  subscription_status: 'premium',
  toss_payment_key: null,
  created_at: pastDate(60)
});

MOCK_DB.users = mockUsers;
MOCK_DB.hardware_profiles = mockHwProfiles;
MOCK_DB.optimization_profiles = mockOptProfiles;

const mockPosts = [
  { id: 'post-mock-1', user_id: 'user-admin-1', title: 'SYNCRIG 커뮤니티 오픈!', content: '환영합니다! 이곳에서 최적화 세팅을 공유해보세요.', views: 120, likes: 45, created_at: pastDate(5) },
  { id: 'post-mock-2', user_id: 'user-mock-1', title: '4090으로 사이버펑크 4K 풀옵션 돌려봤습니다', content: '경이로운 그래픽이네요. 프레임 방어도 아주 잘 됩니다.', views: 80, likes: 20, created_at: pastDate(2) },
  { id: 'post-mock-3', user_id: 'user-mock-5', title: '발로란트 144Hz 방어용 세팅 질문', content: '3060인데 가끔 프레임 드랍이 생기네요. 어떻게 세팅해야 할까요?', views: 42, likes: 5, created_at: pastDate(1) }
];

const mockComments = [
  { id: 'comment-mock-1', post_id: 'post-mock-1', user_id: 'user-mock-2', content: '오픈 축하합니다!!', created_at: pastDate(4) },
  { id: 'comment-mock-2', post_id: 'post-mock-2', user_id: 'user-mock-10', content: '부럽습니다 ㅠㅠ', created_at: pastDate(1) },
  { id: 'comment-mock-3', post_id: 'post-mock-3', user_id: 'user-mock-15', content: '그림자 품질을 낮춰보세요.', created_at: pastDate(0) }
];

MOCK_DB.posts = mockPosts;
MOCK_DB.comments = mockComments;
