import { create } from 'zustand';

const useNotificationStore = create((set, get) => ({
  notifications: [
    {
      id: 1,
      type: 'info',
      title: 'SYNCRIG v2.0 업데이트',
      message: '웹접근성(WCAG 2.1) 및 SEO 최적화가 완료되었습니다.',
      read: false,
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2) // 2시간 전
    },
    {
      id: 2,
      type: 'tip',
      title: '하드웨어 프로필을 등록하세요',
      message: 'PC 사양을 등록하면 AI 매칭 엔진이 최적의 그래픽 설정을 추천해 드립니다.',
      read: false,
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24) // 1일 전
    },
    {
      id: 3,
      type: 'update',
      title: '보안 패치 적용',
      message: 'JWT Refresh Token 시스템이 도입되어 세션 보안이 강화되었습니다.',
      read: false,
      timestamp: new Date()
    },
  ],

  getUnreadCount: () => get().notifications.filter(n => !n.read).length,

  markAsRead: (id) => set(state => ({
    notifications: state.notifications.map(n =>
      n.id === id ? { ...n, read: true } : n
    )
  })),

  markAllRead: () => set(state => ({
    notifications: state.notifications.map(n => ({ ...n, read: true }))
  })),

  addNotification: (notification) => set(state => ({
    notifications: [
      { id: Date.now(), read: false, timestamp: new Date(), ...notification },
      ...state.notifications
    ]
  })),

  removeNotification: (id) => set(state => ({
    notifications: state.notifications.filter(n => n.id !== id)
  })),
}));

export default useNotificationStore;
