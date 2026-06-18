import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Save, Check, FileText, MessageSquare, Cpu, Gamepad2, CreditCard, ChevronRight, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import useAuthStore from '../store/useAuthStore';
import useSEO from '../hooks/useSEO';
import * as api from '../api/apiClient';

export default function MyPage() {
  useSEO('mypage');
  const navigate = useNavigate();
  const { user, setUser, userSpec, gameLibrary } = useAuthStore();
  
  // Local state for profile and activities
  const [nickname, setNickname] = useState(user?.nickname || user?.provider_id || '');
  const [isSaved, setIsSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('posts'); // 'posts' | 'comments'
  
  const [posts, setPosts] = useState([]);
  const [comments, setComments] = useState([]);
  const [profilesCount, setProfilesCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    
    const fetchMyActivities = async () => {
      try {
        setIsLoading(true);
        const [myPosts, myComments, myProfiles] = await Promise.all([
          api.getUserPosts(),
          api.getUserComments(),
          api.fetchHardwareProfiles()
        ]);
        
        setPosts(myPosts || []);
        setComments(myComments || []);
        setProfilesCount(myProfiles?.length || 0);
      } catch (err) {
        console.error('Failed to load user activities:', err);
        toast.error('내 활동 정보를 불러오는 데 실패했습니다.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchMyActivities();
  }, [user]);

  const handleUpdateNickname = async (e) => {
    e.preventDefault();
    if (!nickname.trim()) {
      toast.error('닉네임을 입력해 주세요.');
      return;
    }

    if (nickname.trim().length < 2 || nickname.trim().length > 20) {
      toast.error('닉네임은 2자에서 20자 사이여야 합니다.');
      return;
    }

    try {
      setIsSaving(true);
      const data = await api.updateNickname(nickname.trim());
      api.setToken(data.access_token);
      if (data.refresh_token) {
        api.setRefreshToken(data.refresh_token);
      }
      setUser(data.user);
      setIsSaved(true);
      toast.success('닉네임이 성공적으로 변경되었습니다.');
      setTimeout(() => setIsSaved(false), 2000);
    } catch (err) {
      toast.error(err.message || '닉네임 변경에 실패했습니다.');
    } finally {
      setIsSaving(false);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!user) return null;

  return (
    <div className="space-y-8 animation-fade-in pb-12">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-gray-100 mb-2">마이페이지</h1>
        <p className="text-a11y-muted">개인 프로필 설정과 플랫폼 활동 기록을 관리하세요.</p>
      </div>

      {/* Profile & Membership Info Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Profile Card */}
        <div className="lg:col-span-2 bg-cyber-card rounded-2xl border border-gray-800 shadow-xl p-6 flex flex-col justify-between hover:border-gray-700 transition-colors">
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-cyber-darker border-2 border-cyber-accent flex items-center justify-center text-2xl font-bold text-cyber-accent uppercase">
                {(user.nickname || user.provider_id || 'U').substring(0, 1)}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-bold text-gray-100">{user.nickname || user.provider_id || 'User'}</h2>
                  {user.subscription_status === 'premium' && (
                    <span className="bg-gradient-to-r from-amber-400 to-yellow-600 text-white text-[10px] font-bold px-2 py-0.5 rounded flex items-center">
                      👑 PRO
                    </span>
                  )}
                </div>
                <p className="text-sm text-a11y-muted mt-1">
                  계정 이메일: {user.email || '연동 이메일 없음'}
                </p>
                <div className="flex flex-wrap gap-2 mt-2">
                  <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-cyber-darker text-gray-300 border border-gray-700 capitalize">
                    {user.provider} 가입 계정
                  </span>
                  {user.linked_providers?.map(p => (
                    <span key={p} className="text-[11px] px-2.5 py-0.5 rounded-full bg-cyber-darker text-cyber-accent border border-cyber-accent/30 capitalize">
                      {p} 연동됨
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Nickname Modification Form */}
            <form onSubmit={handleUpdateNickname} className="space-y-2 pt-4 border-t border-gray-800">
              <label htmlFor="mypage-nickname" className="block text-sm font-medium text-gray-300">
                표시 이름 (닉네임) 변경
              </label>
              <div className="flex gap-3">
                <input
                  id="mypage-nickname"
                  type="text"
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  placeholder="새로운 닉네임 입력 (2~20자)"
                  className="flex-1 bg-cyber-darker border border-gray-700 rounded-lg px-4 py-2 text-sm text-gray-200 focus:outline-none focus:border-cyber-accent transition-colors"
                />
                <button
                  type="submit"
                  disabled={isSaving}
                  className="flex items-center gap-2 px-4 py-2 bg-cyber-accent/10 hover:bg-cyber-accent/20 text-cyber-accent border border-cyber-accent/50 rounded-lg transition-colors font-medium text-sm disabled:opacity-50"
                >
                  {isSaving ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : isSaved ? (
                    <Check size={16} />
                  ) : (
                    <Save size={16} />
                  )}
                  {isSaved ? '저장됨' : '저장'}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Membership Upgrade Banner / State Card */}
        <div className="bg-cyber-card rounded-2xl border border-gray-800 shadow-xl p-6 flex flex-col justify-between hover:border-gray-700 transition-colors">
          {user.subscription_status === 'premium' ? (
            <div className="h-full flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-500">Membership</span>
                  <span className="bg-amber-500/10 text-amber-400 border border-amber-500/20 text-[10px] font-bold px-2 py-0.5 rounded-full">ACTIVE</span>
                </div>
                <h3 className="text-xl font-bold text-gray-100 flex items-center gap-2">
                  👑 SYNCRIG PRO
                </h3>
                <p className="text-sm text-a11y-muted mt-3 leading-relaxed">
                  프리미엄 PRO 등급 요금제를 구독 중입니다. AI 게임 최적화 분석 제한 및 실시간 FPS 성능 랭킹 혜택을 마음껏 활용하세요!
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-gray-800 flex items-center justify-between text-xs text-a11y-muted">
                <span>멤버십 혜택 자동 적용 중</span>
                <CreditCard size={16} className="text-amber-500" />
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-bold uppercase tracking-wider text-a11y-muted">Membership</span>
                  <span className="bg-gray-800 text-a11y-muted text-[10px] font-bold px-2 py-0.5 rounded-full">FREE</span>
                </div>
                <h3 className="text-xl font-bold text-gray-200">
                  PRO 멤버십 업그레이드
                </h3>
                <p className="text-sm text-a11y-muted mt-3 leading-relaxed">
                  인게임 옵션 최적화 무제한 요청과 프리미엄 벤치마크 데이터를 해제하여 최고의 게이밍 환경을 구성해 보세요.
                </p>
              </div>
              <button
                onClick={() => navigate('/subscription')}
                className="mt-6 w-full flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-400 hover:to-yellow-500 text-white font-bold py-2.5 rounded-xl transition-all shadow-lg shadow-yellow-600/10 text-sm"
              >
                👑 혜택 알아보기 <ChevronRight size={16} />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Activity Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-cyber-card border border-gray-800 rounded-xl p-4 flex items-center gap-4 hover:border-gray-700 transition-colors">
          <div className="p-3 bg-cyber-darker rounded-lg border border-gray-700 text-cyber-accent">
            <FileText size={20} />
          </div>
          <div>
            <p className="text-xs text-a11y-muted">내가 쓴 글</p>
            <p className="text-xl font-bold text-gray-100 mt-1">{posts.length}개</p>
          </div>
        </div>

        <div className="bg-cyber-card border border-gray-800 rounded-xl p-4 flex items-center gap-4 hover:border-gray-700 transition-colors">
          <div className="p-3 bg-cyber-darker rounded-lg border border-gray-700 text-cyber-purple">
            <MessageSquare size={20} />
          </div>
          <div>
            <p className="text-xs text-a11y-muted">내가 쓴 댓글</p>
            <p className="text-xl font-bold text-gray-100 mt-1">{comments.length}개</p>
          </div>
        </div>

        <div className="bg-cyber-card border border-gray-800 rounded-xl p-4 flex items-center gap-4 hover:border-gray-700 transition-colors">
          <div className="p-3 bg-cyber-darker rounded-lg border border-gray-700 text-cyber-warning">
            <Cpu size={20} />
          </div>
          <div>
            <p className="text-xs text-a11y-muted">내 PC 프로필</p>
            <p className="text-xl font-bold text-gray-100 mt-1">{profilesCount}개</p>
          </div>
        </div>

        <div className="bg-cyber-card border border-gray-800 rounded-xl p-4 flex items-center gap-4 hover:border-gray-700 transition-colors">
          <div className="p-3 bg-cyber-darker rounded-lg border border-gray-700 text-cyber-success">
            <Gamepad2 size={20} />
          </div>
          <div>
            <p className="text-xs text-a11y-muted">연동 게임 수</p>
            <p className="text-xl font-bold text-gray-100 mt-1">{gameLibrary?.length || 0}개</p>
          </div>
        </div>
      </div>

      {/* Tabbed Activity Lists */}
      <div className="bg-cyber-card border border-gray-800 rounded-2xl shadow-xl overflow-hidden">
        {/* Tab Headers */}
        <div className="flex border-b border-gray-800 bg-cyber-darker/50">
          <button
            onClick={() => setActiveTab('posts')}
            className={`flex-1 py-4 text-sm font-semibold transition-all border-b-2 flex items-center justify-center gap-2 ${
              activeTab === 'posts'
                ? 'border-cyber-accent text-cyber-accent bg-cyber-dark/30'
                : 'border-transparent text-a11y-muted hover:text-gray-300'
            }`}
          >
            <FileText size={16} />
            내가 작성한 게시글 ({posts.length})
          </button>
          <button
            onClick={() => setActiveTab('comments')}
            className={`flex-1 py-4 text-sm font-semibold transition-all border-b-2 flex items-center justify-center gap-2 ${
              activeTab === 'comments'
                ? 'border-cyber-purple text-cyber-purple bg-cyber-dark/30'
                : 'border-transparent text-a11y-muted hover:text-gray-300'
            }`}
          >
            <MessageSquare size={16} />
            내가 작성한 댓글 ({comments.length})
          </button>
        </div>

        {/* Tab Contents */}
        <div className="p-6">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-12 gap-3">
              <Loader2 className="w-8 h-8 animate-spin text-cyber-accent" />
              <p className="text-sm text-a11y-muted">활동 데이터를 불러오는 중...</p>
            </div>
          ) : activeTab === 'posts' ? (
            /* Posts Table */
            posts.length === 0 ? (
              <div className="text-center py-12 space-y-4">
                <p className="text-a11y-muted text-sm">아직 작성한 게시글이 없습니다.</p>
                <button
                  onClick={() => navigate('/community/write')}
                  className="px-4 py-2 bg-cyber-accent/10 hover:bg-cyber-accent/20 text-cyber-accent border border-cyber-accent/30 rounded-lg text-xs font-semibold transition-colors"
                >
                  첫 글 작성하기
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-gray-800 text-xs font-semibold text-a11y-muted uppercase tracking-wider">
                      <th className="py-3 px-4 w-16 text-center">번호</th>
                      <th className="py-3 px-4 w-24">카테고리</th>
                      <th className="py-3 px-4">제목</th>
                      <th className="py-3 px-4 w-40 text-center">작성시간</th>
                      <th className="py-3 px-4 w-20 text-center">추천</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-800 text-sm">
                    {posts.map((post, idx) => (
                      <tr
                        key={post.id}
                        onClick={() => navigate(`/community/${post.id}`)}
                        className="hover:bg-cyber-dark/30 transition-colors cursor-pointer group"
                      >
                        <td className="py-3.5 px-4 text-center text-a11y-muted font-medium">
                          {posts.length - idx}
                        </td>
                        <td className="py-3.5 px-4">
                          <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                            post.category === 'qna' 
                              ? 'bg-cyber-purple/10 text-cyber-purple border border-cyber-purple/20' 
                              : 'bg-cyber-accent/10 text-cyber-accent border border-cyber-accent/20'
                          }`}>
                            {post.category === 'qna' ? 'Q&A' : '자유'}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 font-medium text-gray-200 group-hover:text-cyber-accent transition-colors truncate max-w-xs md:max-w-md">
                          {post.title}
                        </td>
                        <td className="py-3.5 px-4 text-center text-xs text-a11y-muted">
                          {formatDate(post.created_at)}
                        </td>
                        <td className="py-3.5 px-4 text-center text-xs font-semibold text-cyber-accent">
                          {post.likes_count || 0}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )
          ) : (
            /* Comments Table */
            comments.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-a11y-muted text-sm">아직 작성한 댓글이 없습니다.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-gray-800 text-xs font-semibold text-a11y-muted uppercase tracking-wider">
                      <th className="py-3 px-4 w-16 text-center">번호</th>
                      <th className="py-3 px-4">댓글 내용</th>
                      <th className="py-3 px-4 w-1/3">원문 게시글 제목</th>
                      <th className="py-3 px-4 w-40 text-center">작성시간</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-800 text-sm">
                    {comments.map((comment, idx) => (
                      <tr
                        key={comment.id}
                        onClick={() => navigate(`/community/${comment.post_id}`)}
                        className="hover:bg-cyber-dark/30 transition-colors cursor-pointer group"
                      >
                        <td className="py-3.5 px-4 text-center text-a11y-muted font-medium">
                          {comments.length - idx}
                        </td>
                        <td className="py-3.5 px-4 font-medium text-gray-200 group-hover:text-cyber-purple transition-colors truncate max-w-xs md:max-w-md">
                          {comment.content}
                        </td>
                        <td className="py-3.5 px-4 text-a11y-muted truncate max-w-[150px] md:max-w-xs">
                          {comment.post_title || '게시글 바로가기'}
                        </td>
                        <td className="py-3.5 px-4 text-center text-xs text-a11y-muted">
                          {formatDate(comment.created_at)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
}
