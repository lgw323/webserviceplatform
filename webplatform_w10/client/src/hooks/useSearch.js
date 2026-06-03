import { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const SEARCHABLE_ITEMS = [
  { label: '대시보드', path: '/dashboard', keywords: ['dashboard', '통계', '플레이타임', '게임', '라이브러리', '업적'], icon: '📊' },
  { label: '하드웨어 프로필', path: '/hardware', keywords: ['hardware', 'cpu', 'gpu', 'ram', '사양', '프로필', '등록'], icon: '🖥️' },
  { label: '최적화 허브', path: '/recommend', keywords: ['optimization', '추천', '세팅', '그래픽', '매칭', '유사도'], icon: '⚡' },
  { label: '환경 설정', path: '/settings', keywords: ['settings', '테마', '언어', '닉네임', '다크모드', '라이트'], icon: '⚙️' },
];

export function useSearch() {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const navigate = useNavigate();
  const containerRef = useRef(null);

  const results = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return SEARCHABLE_ITEMS.filter(item =>
      item.label.toLowerCase().includes(q) ||
      item.keywords.some(k => k.includes(q))
    );
  }, [query]);

  // 결과가 있으면 드롭다운 열기
  useEffect(() => {
    setIsOpen(results.length > 0);
    setSelectedIndex(-1);
  }, [results]);

  const selectResult = useCallback((item) => {
    navigate(item.path);
    setQuery('');
    setIsOpen(false);
  }, [navigate]);

  // 키보드 네비게이션
  const handleKeyDown = useCallback((e) => {
    if (!isOpen || results.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev + 1) % results.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev - 1 + results.length) % results.length);
    } else if (e.key === 'Enter' && selectedIndex >= 0) {
      e.preventDefault();
      selectResult(results[selectedIndex]);
    } else if (e.key === 'Escape') {
      setIsOpen(false);
      setQuery('');
    }
  }, [isOpen, results, selectedIndex, selectResult]);

  // 외부 클릭 시 닫기
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return { query, setQuery, results, isOpen, selectedIndex, selectResult, handleKeyDown, containerRef };
}
