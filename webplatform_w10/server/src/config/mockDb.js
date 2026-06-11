import crypto from 'crypto';

const baseDate = new Date();
const pastDate = (daysAgo) => new Date(baseDate.getTime() - daysAgo * 24 * 60 * 60 * 1000);

export const MOCK_DB = {
  users: [],
  email_verification_codes: [],
  hardware_profiles: [],
  posts: [],
  comments: [],
  post_likes: [],
  games: [
    { id: 'game_cyberpunk', external_app_id: '1091500', title: 'Cyberpunk 2077', created_at: pastDate(30) },
    { id: 'game_valorant', external_app_id: 'valorant', title: 'Valorant', created_at: pastDate(30) },
    { id: 'game_elden', external_app_id: '1245620', title: 'Elden Ring', created_at: pastDate(30) },
    { id: 'game_witcher3', external_app_id: '292030', title: 'The Witcher 3: Wild Hunt', created_at: pastDate(30) },
    { id: 'game_bg3', external_app_id: '1086940', title: 'Baldur\'s Gate 3', created_at: pastDate(25) },
    { id: 'game_palworld', external_app_id: '1623730', title: 'Palworld', created_at: pastDate(20) },
    { id: 'game_wukong', external_app_id: '2358720', title: 'Black Myth: Wukong', created_at: pastDate(10) },
    { id: 'game_marvel', external_app_id: '2767030', title: 'Marvel Rivals', created_at: pastDate(5) }
  ],
  optimization_profiles: []
};

// ═══════════════════════════════════════
// USER SEEDING (30 users across 5 tiers)
// ═══════════════════════════════════════

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
      is_banned: false,
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
        fpsBase = Math.floor(Math.random() * 40) + 100;
        settings = { 'Texture Quality': 'Ultra', 'Ray Tracing': 'Ultra', 'Shadows': 'High', 'DLSS': 'Quality' };
      } else if (tier.tierName === '상위') {
        fpsBase = Math.floor(Math.random() * 30) + 80;
        settings = { 'Texture Quality': 'High', 'Ray Tracing': 'Medium', 'Shadows': 'High', 'DLSS': 'Balanced' };
      } else if (tier.tierName === '미드레인지') {
        fpsBase = Math.floor(Math.random() * 30) + 60;
        settings = { 'Texture Quality': 'High', 'Ray Tracing': 'Off', 'Shadows': 'Medium', 'DLSS': 'Performance' };
      } else if (tier.tierName === '보급형') {
        fpsBase = Math.floor(Math.random() * 20) + 50;
        settings = { 'Texture Quality': 'Medium', 'Ray Tracing': 'Off', 'Shadows': 'Low', 'FSR': 'Performance' };
      } else {
        fpsBase = Math.floor(Math.random() * 15) + 30;
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
  password_hash: 'adminfixedsalt00:bf164aaf887722da6c187e0e0aafe9719d4df44b8512f56474f294417f65b9580be3f60d2fd5813ade83dae39d6d0cceb08e6514c054d4f5fa1c59a00be0fda0',
  email_verified: true,
  role: 'admin',
  is_banned: false,
  linked_providers: [],
  subscription_status: 'premium',
  toss_payment_key: null,
  created_at: pastDate(60)
});

MOCK_DB.users = mockUsers;
MOCK_DB.hardware_profiles = mockHwProfiles;
MOCK_DB.optimization_profiles = mockOptProfiles;

// ═══════════════════════════════════════
// COMMUNITY POST SEEDING (15 posts)
// ═══════════════════════════════════════

const mockPosts = [
  { id: 'post-mock-1', user_id: 'user-admin-1', category: 'free', title: '🎉 SYNCRIG 커뮤니티 오픈!', content: '환영합니다! SYNCRIG 커뮤니티가 정식 오픈했습니다.\n\n이곳에서 PC 하드웨어 최적화 세팅을 공유하고, 다른 유저들과 소통해보세요.\n\n카테고리별로 자유롭게 글을 작성할 수 있습니다:\n- 자유 게시판: 일반 대화\n- 팁 공유: 최적화 노하우\n- 하드웨어: 리뷰/질문\n- 버그 리포트: 문제 신고', views: 234, likes: 67, is_pinned: true, is_hidden: false, created_at: pastDate(14), updated_at: pastDate(14) },
  { id: 'post-mock-2', user_id: 'user-mock-1', category: 'tips', title: '4090으로 사이버펑크 2077 4K 풀옵션 돌려봤습니다', content: 'i9-14900K + RTX 4090 + 64GB RAM 조합입니다.\n\n레이 트레이싱 울트라, DLSS Quality 설정으로 4K에서 평균 95fps 정도 나옵니다.\nDLSS를 Performance로 바꾸면 120fps 이상도 가능해요.\n\n패스 트레이싱 켜면 70fps 정도로 떨어지긴 하지만 시각적으로 엄청난 차이가 납니다.\n\n사이버펑크 최적화 세팅 궁금하신 분 댓글 남겨주세요!', views: 156, likes: 42, is_pinned: false, is_hidden: false, created_at: pastDate(12), updated_at: pastDate(12) },
  { id: 'post-mock-3', user_id: 'user-mock-15', category: 'hardware', title: '발로란트 144Hz 방어용 세팅 질문', content: 'RTX 3060 + R5 5600X + 16GB RAM 조합입니다.\n\n발로란트에서 대부분 200fps 이상 나오는데, 연막 많은 상황에서 가끔 144 밑으로 떨어져요.\n\n혹시 비슷한 사양에서 안정적으로 144 방어하는 세팅 아시는 분 계신가요?\n렌더 스케일이나 안티앨리어싱 관련 팁 부탁드립니다.', views: 89, likes: 12, is_pinned: false, is_hidden: false, created_at: pastDate(10), updated_at: pastDate(10) },
  { id: 'post-mock-4', user_id: 'user-mock-6', category: 'tips', title: '엘든 링 QHD 최적 세팅 공유 (4070 Ti SUPER)', content: 'RTX 4070 Ti SUPER + i7-13700K + 32GB\n\n엘든 링은 프레임 캡이 60이라 쾌적하게 돌아갑니다.\n\n텍스처: 최고\n안티앨리어싱: 높음\n그림자: 높음\nSSAO: 중간\n\n이 세팅으로 QHD에서 일정하게 60fps 유지합니다.\n공유 세팅을 프로필에 올려뒀으니 참고하세요!', views: 134, likes: 38, is_pinned: false, is_hidden: false, created_at: pastDate(9), updated_at: pastDate(9) },
  { id: 'post-mock-5', user_id: 'user-mock-20', category: 'hardware', title: 'GTX 1660 SUPER 아직 쓸만한가요?', content: '보급형 빌드로 게임하고 있는데, 1660 SUPER가 요즘 게임에서 얼마나 버텨주는지 궁금합니다.\n\n발로란트 같은 가벼운 게임은 괜찮은데, 최신 AAA는 좀 힘든 것 같아요.\n\n업그레이드 시점을 고민 중인데, 의견 부탁드립니다.\n\n예산은 30~40만원 정도입니다.', views: 67, likes: 8, is_pinned: false, is_hidden: false, created_at: pastDate(8), updated_at: pastDate(8) },
  { id: 'post-mock-6', user_id: 'user-mock-3', category: 'tips', title: '발더스 게이트 3 최적화 꿀팁 모음', content: 'BG3 최적화 팁을 정리해봤습니다.\n\n1. 볼류메트릭 클라우드를 중간으로 낮추면 큰 프레임 이득\n2. 모델 품질은 높음까지만 해도 충분\n3. 그림자 품질은 성능에 큰 영향을 미침\n4. DLSS/FSR 활용 필수 (4K 이상에서)\n\nRTX 4090 기준 4K 울트라에서 평균 80fps 정도 나옵니다.\n위 팁 적용하면 100fps 이상도 가능합니다.', views: 198, likes: 55, is_pinned: false, is_hidden: false, created_at: pastDate(7), updated_at: pastDate(7) },
  { id: 'post-mock-7', user_id: 'user-mock-10', category: 'free', title: '흑신화: 오공 그래픽 진짜 미쳤네요', content: '방금 흑신화 처음 해봤는데 그래픽이 진짜 대단하네요.\n\nRTX 3060으로 FHD 중간 세팅에서 60fps 나옵니다.\n레이 트레이싱 끄고 FSR Performance 쓰면 꽤 쾌적합니다.\n\n오늘부터 SYNCRIG에 세팅 프로필 올릴 예정입니다.\n다들 흑신화 하고 계신가요?', views: 112, likes: 23, is_pinned: false, is_hidden: false, created_at: pastDate(6), updated_at: pastDate(6) },
  { id: 'post-mock-8', user_id: 'user-mock-8', category: 'tips', title: 'Palworld 서버 최적화 가이드', content: 'Palworld 전용 서버를 돌리면서 클라이언트도 같이 플레이하는 분들을 위한 팁입니다.\n\n서버 + 클라이언트 동시 실행 시:\n- RAM 최소 32GB 권장\n- 뷰 디스턴스를 중간으로 낮추기\n- 그림자 품질 낮음\n- 식생 품질 중간\n\n이 세팅으로 QHD 기준 70fps 안정적으로 유지합니다.', views: 76, likes: 19, is_pinned: false, is_hidden: false, created_at: pastDate(5), updated_at: pastDate(5) },
  { id: 'post-mock-9', user_id: 'user-mock-25', category: 'bug', title: '매칭 결과에서 GPU 이름이 잘못 표시되는 문제', content: '추천 결과에서 제 GPU가 "NVIDIA GeForce RTX 3050"인데 "RTX 30"으로 잘려서 나옵니다.\n\n브라우저: Chrome 최신\n해상도: FHD\n\n재현 방법:\n1. 하드웨어 프로필 등록\n2. 최적화 허브에서 추천 검색\n3. 결과 카드에서 GPU 이름 확인\n\n스크린샷은 첨부 못했지만 확인 부탁드립니다.', views: 34, likes: 3, is_pinned: false, is_hidden: false, created_at: pastDate(4), updated_at: pastDate(4) },
  { id: 'post-mock-10', user_id: 'user-mock-2', category: 'tips', title: 'Marvel Rivals 4K 최적 세팅 (RTX 4090)', content: 'Marvel Rivals를 4K에서 쾌적하게 즐기는 세팅입니다.\n\n텍스처: 에픽\n그림자: 높음\n효과: 높음\n포스트 프로세싱: 높음\nDLSS: Quality\n레이 트레이싱: 높음\n\n이 세팅으로 평균 130fps, 1% Low 95fps 정도 나옵니다.\n프로필에 올려뒀으니 SYNCRIG에서 확인해보세요!', views: 145, likes: 41, is_pinned: false, is_hidden: false, created_at: pastDate(3), updated_at: pastDate(3) },
  { id: 'post-mock-11', user_id: 'user-mock-13', category: 'hardware', title: 'RTX 4060 vs RX 6700 XT 실사용 비교', content: '두 그래픽 카드를 모두 사용해본 경험을 공유합니다.\n\n게임 성능:\n- FHD 기준 비슷한 수준 (RX 6700 XT가 약간 우위)\n- 레이 트레이싱은 RTX 4060이 훨씬 좋음\n- DLSS 3 프레임 생성은 RTX 4060만의 장점\n\n전력 소비:\n- RTX 4060: ~115W\n- RX 6700 XT: ~230W\n\n결론: 1080p 래스터만이면 6700 XT, RT/효율이면 4060', views: 203, likes: 48, is_pinned: false, is_hidden: false, created_at: pastDate(2), updated_at: pastDate(2) },
  { id: 'post-mock-12', user_id: 'user-mock-18', category: 'free', title: '위쳐3 넥스트젠 업데이트 세팅 질문', content: 'GTX 1660 SUPER로 위쳐3 넥스트젠 어느 정도까지 돌릴 수 있나요?\n\n기존 위쳐3은 울트라로 60fps 잘 나왔는데, 넥스트젠 업데이트 후에는 많이 무거워진 것 같아요.\n\n비슷한 사양의 유저분들 세팅 공유 부탁드립니다!', views: 56, likes: 7, is_pinned: false, is_hidden: false, created_at: pastDate(2), updated_at: pastDate(2) },
  { id: 'post-mock-13', user_id: 'user-mock-7', category: 'tips', title: 'DLSS vs FSR vs XeSS 비교 총정리 (2025 최신)', content: '최신 업스케일링 기술 3종 비교입니다.\n\nDLSS 3.5 (NVIDIA 전용):\n- AI 기반 최고의 화질\n- 프레임 생성으로 FPS 2배\n- RTX 20/30/40 시리즈 지원\n\nFSR 3 (모든 GPU):\n- 오픈소스, 범용성 최고\n- DLSS 대비 약간 열위하지만 갈수록 개선\n\nXeSS (Intel, 범용 모드 있음):\n- DP4a 모드로 거의 모든 GPU 지원\n- 성능은 FSR과 DLSS 중간\n\nSYNCRIG 프로필에서 각 기술별 FPS 차이도 확인할 수 있습니다!', views: 278, likes: 72, is_pinned: false, is_hidden: false, created_at: pastDate(1), updated_at: pastDate(1) },
  { id: 'post-mock-14', user_id: 'user-mock-22', category: 'bug', title: 'Steam 연동 후 게임 라이브러리가 안 뜹니다', content: 'Steam 계정 연동까지는 잘 됐는데, 대시보드에서 게임 라이브러리가 비어있습니다.\n\n환경:\n- Chrome 최신\n- Windows 11\n- Steam 프로필 공개 설정 완료\n\n연동 해제 후 다시 해봐도 같은 상태입니다.\n혹시 같은 문제 겪으신 분 계신가요?', views: 42, likes: 5, is_pinned: false, is_hidden: false, created_at: pastDate(1), updated_at: pastDate(1) },
  { id: 'post-mock-15', user_id: 'user-mock-4', category: 'hardware', title: '7800X3D vs 14900K 게임 성능 직접 비교', content: '두 CPU를 같은 시스템에서 교체하며 테스트했습니다.\n\nRTX 4090 + 64GB DDR5 기준:\n\n사이버펑크 2077 (4K RT Ultra):\n- 7800X3D: 평균 98fps\n- 14900K: 평균 92fps\n\n발로란트 (FHD Low):\n- 7800X3D: 평균 620fps\n- 14900K: 평균 580fps\n\n엘든 링 (4K Max):\n- 거의 동일 (60fps 캡)\n\n결론: 순수 게임 성능은 7800X3D가 약간 우위.\n멀티태스킹/작업용이면 14900K.', views: 312, likes: 89, is_pinned: false, is_hidden: false, created_at: pastDate(0), updated_at: pastDate(0) }
];

const mockComments = [
  { id: 'comment-mock-1', post_id: 'post-mock-1', user_id: 'user-mock-2', content: '오픈 축하합니다!! 좋은 플랫폼이 될 것 같아요 🎉', is_hidden: false, created_at: pastDate(13) },
  { id: 'comment-mock-2', post_id: 'post-mock-2', user_id: 'user-mock-10', content: '4090 부럽습니다 ㅠㅠ 저는 3060으로 중간에서 버티고 있어요', is_hidden: false, created_at: pastDate(11) },
  { id: 'comment-mock-3', post_id: 'post-mock-2', user_id: 'user-mock-5', content: 'DLSS Quality 쓰면 네이티브랑 거의 차이 안 느껴지죠? 저도 같은 세팅인데 만족스럽습니다.', is_hidden: false, created_at: pastDate(11) },
  { id: 'comment-mock-4', post_id: 'post-mock-3', user_id: 'user-mock-16', content: '그림자 품질을 낮추고 멀티스레드 렌더링 켜보세요. 저도 비슷한 사양인데 효과 봤습니다.', is_hidden: false, created_at: pastDate(9) },
  { id: 'comment-mock-5', post_id: 'post-mock-3', user_id: 'user-mock-12', content: '발로란트는 CPU 바운드가 큰 게임이라 5600X면 충분할 것 같은데요. 백그라운드 프로세스 확인해보셨나요?', is_hidden: false, created_at: pastDate(9) },
  { id: 'comment-mock-6', post_id: 'post-mock-5', user_id: 'user-mock-21', content: '저도 같은 고민 중입니다. RTX 4060이 가격 대비 좋다고 하는데 어떤가요?', is_hidden: false, created_at: pastDate(7) },
  { id: 'comment-mock-7', post_id: 'post-mock-6', user_id: 'user-mock-9', content: '볼류메트릭 클라우드 팁 감사합니다! 10프레임 정도 올라갔어요.', is_hidden: false, created_at: pastDate(6) },
  { id: 'comment-mock-8', post_id: 'post-mock-7', user_id: 'user-mock-14', content: '저도 방금 시작했는데 그래픽 정말 대단합니다. 프로필 올려주시면 참고할게요!', is_hidden: false, created_at: pastDate(5) },
  { id: 'comment-mock-9', post_id: 'post-mock-11', user_id: 'user-mock-19', content: '전력 소비 차이가 2배네요. 전기세 생각하면 4060이 낫겠다..', is_hidden: false, created_at: pastDate(1) },
  { id: 'comment-mock-10', post_id: 'post-mock-13', user_id: 'user-mock-11', content: 'FSR 3가 많이 좋아졌더라고요. AMD GPU 유저로서 반갑습니다!', is_hidden: false, created_at: pastDate(0) },
  { id: 'comment-mock-11', post_id: 'post-mock-15', user_id: 'user-mock-1', content: '7800X3D 3D V-Cache의 위력이네요. 게임 전용이면 이게 답인 것 같습니다.', is_hidden: false, created_at: pastDate(0) },
  { id: 'comment-mock-12', post_id: 'post-mock-15', user_id: 'user-mock-6', content: '발로란트에서 600fps 넘는 게 놀랍네요 ㅋㅋ 모니터가 못 따라가겠다', is_hidden: false, created_at: pastDate(0) }
];

// Generate some mock likes
const mockLikes = [];
for (const post of mockPosts) {
  const likeCount = post.likes;
  const shuffledUsers = [...mockUsers].sort(() => Math.random() - 0.5);
  for (let i = 0; i < Math.min(likeCount, shuffledUsers.length); i++) {
    mockLikes.push({
      id: `like-${post.id}-${shuffledUsers[i].id}`,
      post_id: post.id,
      user_id: shuffledUsers[i].id,
      created_at: pastDate(Math.floor(Math.random() * 14))
    });
  }
}

MOCK_DB.posts = mockPosts;
MOCK_DB.comments = mockComments;
MOCK_DB.post_likes = mockLikes;
