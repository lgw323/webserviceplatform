import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageSquare, ThumbsUp, Eye, Plus, Loader2, Pin, TrendingUp, ChevronLeft, ChevronRight } from 'lucide-react';
import * as api from '../api/apiClient';
import useAuthStore from '../store/useAuthStore';

const CATEGORIES = [
  { key: 'all', label: '전체', emoji: '📋' },
  { key: 'free', label: '자유', emoji: '💬' },
  { key: 'tips', label: '팁 공유', emoji: '💡' },
  { key: 'hardware', label: '하드웨어', emoji: '🖥️' },
  { key: 'bug', label: '버그 리포트', emoji: '🐛' },
];

const CATEGORY_BADGES = {
  free: { label: '자유', color: 'bg-gray-700 text-gray-300' },
  tips: { label: '팁', color: 'bg-emerald-500/20 text-emerald-400' },
  hardware: { label: 'HW', color: 'bg-blue-500/20 text-blue-400' },
  bug: { label: '버그', color: 'bg-red-500/20 text-red-400' },
};

export default function CommunityPage() {
  const [posts, setPosts] = useState([]);
  const [popularPosts, setPopularPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [sort, setSort] = useState('latest');
  const [limit, setLimit] = useState(20);
  const navigate = useNavigate();
  const { user } = useAuthStore();

  useEffect(() => {
    fetchPosts();
  }, [activeCategory, currentPage, sort, limit]);

  useEffect(() => {
    fetchPopularPosts();
  }, []);

  const fetchPosts = async () => {
    setIsLoading(true);
    try {
      const result = await api.getPosts(activeCategory, currentPage, sort, limit);
      setPosts(result.data || []);
      setTotalCount(result.pagination?.total || 0);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchPopularPosts = async () => {
    try {
      const result = await api.getPosts('all', 1, 'popular', 5);
      setPopularPosts((result.data || []).slice(0, 5));
    } catch (err) {
      console.error(err);
    }
  };

  const totalPages = Math.max(1, Math.ceil(totalCount / limit));
  const badge = (cat) => CATEGORY_BADGES[cat] || CATEGORY_BADGES.free;

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto animation-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-black bg-clip-text text-transparent bg-gradient-to-r from-cyber-accent to-cyber-purple">COMMUNITY</h1>
          <p className="text-a11y-muted mt-1">유저들과 최적화 정보 및 질문을 공유하세요.</p>
        </div>
        {user && (
          <button 
            onClick={() => navigate('/community/write')}
            className="flex items-center gap-2 px-5 py-2.5 bg-cyber-accent hover:bg-blue-600 text-white rounded-lg transition-colors shadow-lg shadow-blue-500/20 font-medium"
          >
            <Plus className="w-4 h-4" />
            새 글 작성
          </button>
        )}
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Main content */}
        <div className="flex-1 min-w-0">
          {/* Category Tabs */}
          <div className="flex gap-1 bg-cyber-card border border-gray-800 rounded-xl p-1.5 mb-4 overflow-x-auto">
            {CATEGORIES.map(cat => (
              <button
                key={cat.key}
                onClick={() => { setActiveCategory(cat.key); setCurrentPage(1); }}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                  activeCategory === cat.key 
                    ? 'bg-cyber-accent/15 text-cyber-accent border border-cyber-accent/30' 
                    : 'text-gray-400 hover:text-gray-200 hover:bg-cyber-dark'
                }`}
              >
                <span>{cat.emoji}</span>
                {cat.label}
              </button>
            ))}
          </div>

          {/* Filters & Sorting Panel */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4 bg-cyber-card border border-gray-800/60 p-3.5 rounded-xl">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-gray-400">정렬 기준</span>
              <select
                value={sort}
                onChange={(e) => { setSort(e.target.value); setCurrentPage(1); }}
                className="bg-cyber-darker border border-gray-800 rounded-lg px-3 py-1.5 text-xs text-gray-200 focus:outline-none focus:border-cyber-accent transition-colors"
              >
                <option value="latest">최신순</option>
                <option value="popular">인기순</option>
                <option value="views">조회수순</option>
                <option value="alphabetical">제목순</option>
              </select>
            </div>

            <div className="flex items-center gap-2 self-end sm:self-auto">
              <span className="text-xs font-semibold text-gray-400">보기 개수</span>
              <select
                value={limit}
                onChange={(e) => { setLimit(parseInt(e.target.value, 10)); setCurrentPage(1); }}
                className="bg-cyber-darker border border-gray-800 rounded-lg px-3 py-1.5 text-xs text-gray-200 focus:outline-none focus:border-cyber-accent transition-colors"
              >
                <option value={10}>10개씩 보기</option>
                <option value={20}>20개씩 보기</option>
                <option value={30}>30개씩 보기</option>
                <option value={40}>40개씩 보기</option>
                <option value={50}>50개씩 보기</option>
              </select>
            </div>
          </div>

          {/* Post List */}
          {isLoading ? (
            <div className="flex justify-center py-16"><Loader2 className="w-8 h-8 animate-spin text-cyber-accent" /></div>
          ) : (
            <div className="space-y-2">
              {posts.map(post => {
                const b = badge(post.category);
                return (
                  <div 
                    key={post.id} 
                    onClick={() => navigate(`/community/${post.id}`)}
                    className={`bg-cyber-card border p-5 rounded-xl cursor-pointer transition-all hover:shadow-lg group ${
                      post.is_pinned 
                        ? 'border-yellow-500/40 bg-yellow-500/[0.02] shadow-[0_0_15px_rgba(245,158,11,0.05)] border-l-4 border-l-yellow-500' 
                        : 'border-gray-800 hover:border-gray-600'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      {post.is_pinned && <Pin className="w-4 h-4 text-yellow-500 mt-1 flex-shrink-0" />}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1.5">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${b.color}`}>{b.label}</span>
                          <h2 className="text-base font-bold text-gray-100 group-hover:text-cyber-accent transition-colors truncate">{post.title}</h2>
                        </div>
                        <div className="flex items-center gap-4 text-xs text-gray-400">
                          <span className="text-gray-300 font-medium">{post.nickname || '익명'}</span>
                          <span>{new Date(post.created_at).toLocaleDateString()}</span>
                          <span className="flex items-center gap-1"><Eye className="w-3.5 h-3.5" /> {post.views}</span>
                          <span className="flex items-center gap-1"><ThumbsUp className="w-3.5 h-3.5" /> {post.likes}</span>
                          <span className="flex items-center gap-1"><MessageSquare className="w-3.5 h-3.5" /> {post.comment_count || 0}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
              {posts.length === 0 && (
                <div className="text-center py-16 text-gray-500">
                  <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-30" />
                  이 카테고리에 게시글이 없습니다.
                </div>
              )}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-6">
              <button 
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))} 
                disabled={currentPage === 1}
                className="p-2 rounded-lg bg-cyber-card border border-gray-800 text-gray-400 hover:text-white disabled:opacity-30 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                <button
                  key={p}
                  onClick={() => setCurrentPage(p)}
                  className={`w-9 h-9 rounded-lg text-sm font-medium transition-colors ${
                    currentPage === p 
                      ? 'bg-cyber-accent text-white' 
                      : 'bg-cyber-card border border-gray-800 text-gray-400 hover:text-white'
                  }`}
                >
                  {p}
                </button>
              ))}
              <button 
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} 
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg bg-cyber-card border border-gray-800 text-gray-400 hover:text-white disabled:opacity-30 transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* Sidebar — Popular Posts */}
        <aside className="w-full lg:w-72 shrink-0">
          <div className="bg-cyber-card border border-gray-800 rounded-xl p-5 sticky top-6">
            <h3 className="font-bold text-white flex items-center gap-2 mb-4">
              <TrendingUp className="w-4 h-4 text-yellow-500" />
              인기 게시글
            </h3>
            <div className="space-y-3">
              {popularPosts.map((post, idx) => (
                <button
                  key={post.id}
                  onClick={() => navigate(`/community/${post.id}`)}
                  className="w-full text-left group"
                >
                  <div className="flex items-start gap-2.5">
                    <span className={`text-xs font-black mt-0.5 w-5 ${idx < 3 ? 'text-yellow-500' : 'text-gray-600'}`}>{idx + 1}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-300 group-hover:text-cyber-accent transition-colors truncate font-medium">{post.title}</p>
                      <p className="text-[10px] text-gray-500 mt-0.5 flex items-center gap-2">
                        <span className="flex items-center gap-0.5"><ThumbsUp className="w-3 h-3" /> {post.likes}</span>
                        <span className="flex items-center gap-0.5"><Eye className="w-3 h-3" /> {post.views}</span>
                      </p>
                    </div>
                  </div>
                </button>
              ))}
              {popularPosts.length === 0 && (
                <p className="text-xs text-gray-600 text-center py-4">게시글이 없습니다.</p>
              )}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
