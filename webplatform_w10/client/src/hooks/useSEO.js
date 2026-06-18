/**
 * useSEO — SPA 동적 SEO 메타 관리 훅
 * 탭 전환 시 document.title 과 meta description 을 자동 업데이트합니다.
 */
import { useEffect } from 'react';

const PAGE_META = {
  dashboard: {
    title: 'SYNCRIG - 대시보드 | 게임 통계 및 하드웨어 요약',
    description: 'Steam/Riot 연동 게임 플레이타임 통계와 PC 하드웨어 요약을 확인하세요.',
  },
  hardware: {
    title: 'SYNCRIG - 하드웨어 프로필 | PC 사양 관리',
    description: 'GPU, CPU, RAM, 해상도 등 PC 사양을 등록하고 관리하여 최적화 매칭에 활용하세요.',
  },
  recommend: {
    title: 'SYNCRIG - 최적화 허브 | AI 그래픽 세팅 추천',
    description: 'AI 매칭 엔진이 보유 하드웨어에 가장 적합한 인게임 그래픽 설정을 추천합니다.',
  },
  settings: {
    title: 'SYNCRIG - 환경 설정 | 테마 · 언어 · 계정',
    description: '앱 테마(다크/라이트), 시스템 언어, 계정 프로필을 관리하세요.',
  },
  mypage: {
    title: 'SYNCRIG - 마이페이지 | 내 활동 및 프로필 관리',
    description: '작성한 글과 댓글을 확인하고 계정 프로필, 닉네임, 멤버십 상태를 확인하세요.',
  },
};

const DEFAULT_META = {
  title: 'SYNCRIG - AI 기반 하드웨어 최적화 그래픽 세팅 추천 플랫폼',
  description: 'SYNCRIG은 PC 하드웨어 사양을 분석하여 가장 적합한 인게임 그래픽 세팅을 추천하는 AI 기반 웹 플랫폼입니다.',
};

export default function useSEO(activeTab) {
  useEffect(() => {
    const meta = PAGE_META[activeTab] || DEFAULT_META;

    // Update document title
    document.title = meta.title;

    // Update meta description
    const descTag = document.querySelector('meta[name="description"]');
    if (descTag) {
      descTag.setAttribute('content', meta.description);
    }

    // Update OG tags
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.setAttribute('content', meta.title);

    const ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc) ogDesc.setAttribute('content', meta.description);

    // Update Twitter tags
    const twTitle = document.querySelector('meta[name="twitter:title"]');
    if (twTitle) twTitle.setAttribute('content', meta.title);

    const twDesc = document.querySelector('meta[name="twitter:description"]');
    if (twDesc) twDesc.setAttribute('content', meta.description);
  }, [activeTab]);
}
