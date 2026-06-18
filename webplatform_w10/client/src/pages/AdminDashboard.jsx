import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldAlert, Users, Trash2, Database, TrendingUp, Cpu, Loader2, Search, Ban, Shield, Eye, EyeOff, BarChart3 } from 'lucide-react';
import { LineChart, Line, PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import * as api from '../api/apiClient';
import useAuthStore from '../store/useAuthStore';
import toast from 'react-hot-toast';

const CHART_COLORS = ['#3b82f6', '#f59e0b', '#10b981', '#ef4444', '#8b5cf6', '#ec4899'];

export default function AdminDashboard() {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(() => {
    return sessionStorage.getItem('syncrig_admin_user_search') || '';
  });
  const [userFilter, setUserFilter] = useState('');
  const [activeTab, setActiveTab] = useState(() => {
    return sessionStorage.getItem('syncrig_admin_active_tab') || 'overview';
  });
  const [postSearchQuery, setPostSearchQuery] = useState(() => {
    return sessionStorage.getItem('syncrig_admin_post_search') || '';
  });
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: null
  });

  useEffect(() => {
    sessionStorage.setItem('syncrig_admin_active_tab', activeTab);
  }, [activeTab]);

  useEffect(() => {
    sessionStorage.setItem('syncrig_admin_user_search', searchQuery);
  }, [searchQuery]);

  useEffect(() => {
    sessionStorage.setItem('syncrig_admin_post_search', postSearchQuery);
  }, [postSearchQuery]);

  useEffect(() => {
    if (user?.role !== 'admin') {
      navigate('/dashboard');
      return;
    }
    fetchData();
  }, [user, navigate]);

  const fetchData = async () => {
    try {
      const [statsData, usersData, postsData] = await Promise.all([
        api.getAdminStats(),
        api.getAdminUsers(searchQuery, userFilter),
        api.getAdminPosts()
      ]);
      setStats(statsData);
      setUsers(usersData);
      setPosts(postsData.data || postsData);
    } catch (err) {
      console.error(err);
      toast.error('통계 데이터를 불러오지 못했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = async () => {
    try {
      const usersData = await api.getAdminUsers(searchQuery, userFilter);
      setUsers(usersData);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (!isLoading) handleSearch();
  }, [searchQuery, userFilter]);

  const handleRoleChange = (userId, currentRole) => {
    const newRole = currentRole === 'admin' ? 'user' : 'admin';
    setConfirmModal({
      isOpen: true,
      title: '권한 변경',
      message: `이 유저의 역할을 ${newRole.toUpperCase()}로 변경하시겠습니까?`,
      onConfirm: async () => {
        try {
          await api.updateUserRole(userId, newRole);
          toast.success(`유저 권한이 ${newRole.toUpperCase()}로 변경되었습니다.`);
          fetchData();
        } catch (err) {
          toast.error(err.message || '역할 변경 실패');
        }
      }
    });
  };

  const handleBan = (userId, isBanned) => {
    const action = isBanned ? '차단 해제' : '차단';
    setConfirmModal({
      isOpen: true,
      title: `유저 ${action}`,
      message: `이 유저를 ${action}하시겠습니까?`,
      onConfirm: async () => {
        try {
          await api.toggleUserBan(userId, !isBanned);
          toast.success(`유저가 성공적으로 ${action}되었습니다.`);
          fetchData();
        } catch (err) {
          toast.error(err.message || `${action} 실패`);
        }
      }
    });
  };

  const handleToggleHide = async (postId, isHidden) => {
    try {
      await api.togglePostVisibility(postId, !isHidden);
      toast.success(isHidden ? '게시글 숨김이 해제되었습니다.' : '게시글이 숨김 처리되었습니다.');
      fetchData();
    } catch (err) {
      toast.error(err.message || '처리 실패');
    }
  };

  const handleDeletePost = (id) => {
    setConfirmModal({
      isOpen: true,
      title: '게시글 삭제',
      message: '정말 이 게시글을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.',
      onConfirm: async () => {
        try {
          await api.deletePostByAdmin(id);
          toast.success('게시글이 삭제되었습니다.');
          fetchData();
        } catch (err) {
          toast.error(err.message || '삭제 실패');
        }
      }
    });
  };

  if (isLoading) {
    return <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-cyber-accent" /></div>;
  }

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto space-y-6 animation-fade-in">
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-red-900/30 pb-4">
        <ShieldAlert className="w-8 h-8 text-cyber-danger" />
        <div>
          <h1 className="text-3xl font-black text-white">ADMIN DASHBOARD</h1>
          <p className="text-red-400 text-sm">운영 및 관리 시스템</p>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-1 bg-cyber-card border border-gray-800 rounded-xl p-1.5">
        {[
          { key: 'overview', label: '📊 개요', icon: BarChart3 },
          { key: 'users', label: '👥 유저 관리', icon: Users },
          { key: 'posts', label: '📝 게시물 관리', icon: Database },
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === tab.key
                ? 'bg-red-500/15 text-red-400 border border-red-500/30'
                : 'text-gray-400 hover:text-gray-200 hover:bg-cyber-dark'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ═══ OVERVIEW TAB ═══ */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* KPI Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-cyber-card border border-red-900/50 p-5 rounded-xl">
              <div className="flex items-center gap-2 text-gray-400 text-xs mb-2"><Users className="w-4 h-4" /> 총 가입 유저</div>
              <div className="text-3xl font-bold text-white">{stats?.totalUsers || 0}<span className="text-sm text-gray-500 ml-1">명</span></div>
              {stats?.newUsersToday > 0 && (
                <div className="text-xs text-emerald-400 mt-1">+{stats.newUsersToday} 오늘</div>
              )}
            </div>
            <div className="bg-cyber-card border border-red-900/50 p-5 rounded-xl">
              <div className="flex items-center gap-2 text-yellow-500 text-xs mb-2"><TrendingUp className="w-4 h-4" /> PRO 전환율</div>
              <div className="text-3xl font-bold text-yellow-500">{stats?.premiumRate || 0}<span className="text-sm ml-0.5">%</span></div>
              <div className="text-xs text-gray-500 mt-1">{stats?.premiumUsers || 0}명 구독 중</div>
            </div>
            <div className="bg-cyber-card border border-red-900/50 p-5 rounded-xl">
              <div className="flex items-center gap-2 text-blue-400 text-xs mb-2"><Database className="w-4 h-4" /> 총 게시물</div>
              <div className="text-3xl font-bold text-white">{stats?.totalPosts || 0}<span className="text-sm text-gray-500 ml-1">개</span></div>
            </div>
            <div className="bg-cyber-card border border-red-900/50 p-5 rounded-xl">
              <div className="flex items-center gap-2 text-green-400 text-xs mb-2"><Cpu className="w-4 h-4" /> 최적화 프로필</div>
              <div className="text-3xl font-bold text-white">{stats?.totalOptimizations || 0}<span className="text-sm text-gray-500 ml-1">개</span></div>
            </div>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Daily Signups Line Chart */}
            <div className="bg-cyber-card border border-gray-800 rounded-xl p-5">
              <h3 className="font-bold text-white mb-4 text-sm">📈 일별 가입자 추이 (14일)</h3>
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={stats?.dailySignups || []}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
                  <XAxis dataKey="date" tick={{ fill: '#6b7280', fontSize: 10 }} tickFormatter={(v) => v.slice(5)} />
                  <YAxis tick={{ fill: '#6b7280', fontSize: 10 }} allowDecimals={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#111827', border: '1px solid #374151', borderRadius: '8px', fontSize: '12px' }}
                    labelStyle={{ color: '#9ca3af' }}
                  />
                  <Line type="monotone" dataKey="count" stroke="#3b82f6" strokeWidth={2} dot={{ fill: '#3b82f6', r: 3 }} name="가입자" />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Subscription Distribution Pie Chart */}
            <div className="bg-cyber-card border border-gray-800 rounded-xl p-5">
              <h3 className="font-bold text-white mb-4 text-sm">🎯 구독 티어 분포</h3>
              <div className="flex items-center justify-center gap-8">
                <ResponsiveContainer width={180} height={180}>
                  <PieChart>
                    <Pie
                      data={stats?.subscriptionDistribution || []}
                      cx="50%" cy="50%"
                      innerRadius={50} outerRadius={80}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {(stats?.subscriptionDistribution || []).map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: '#111827', border: '1px solid #374151', borderRadius: '8px', fontSize: '12px' }} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="space-y-3">
                  {(stats?.subscriptionDistribution || []).map((entry, idx) => (
                    <div key={entry.name} className="flex items-center gap-2.5">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: CHART_COLORS[idx] }} />
                      <span className="text-sm text-gray-300">{entry.name}</span>
                      <span className="text-sm font-bold text-white">{entry.value}명</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Category Distribution Bar Chart */}
            <div className="bg-cyber-card border border-gray-800 rounded-xl p-5 lg:col-span-2">
              <h3 className="font-bold text-white mb-4 text-sm">📊 카테고리별 게시글 분포</h3>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={stats?.categoryDistribution || []}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
                  <XAxis dataKey="name" tick={{ fill: '#9ca3af', fontSize: 12 }} />
                  <YAxis tick={{ fill: '#6b7280', fontSize: 10 }} allowDecimals={false} />
                  <Tooltip contentStyle={{ backgroundColor: '#111827', border: '1px solid #374151', borderRadius: '8px', fontSize: '12px' }} />
                  <Bar dataKey="value" name="게시글 수" radius={[6, 6, 0, 0]}>
                    {(stats?.categoryDistribution || []).map((entry, index) => (
                      <Cell key={`bar-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* ═══ USERS TAB ═══ */}
      {activeTab === 'users' && (
        <div className="space-y-4">
          {/* Search & Filter */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 flex items-center bg-cyber-darker rounded-lg px-4 py-2 border border-gray-800">
              <Search className="w-4 h-4 text-gray-500 mr-2" />
              <input
                type="text"
                placeholder="이메일 또는 닉네임 검색..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent border-none outline-none text-sm w-full text-gray-200"
              />
            </div>
            <div className="flex gap-1">
              {['', 'admin', 'premium', 'banned'].map(f => (
                <button
                  key={f}
                  onClick={() => setUserFilter(f)}
                  className={`px-3 py-2 text-xs font-medium rounded-lg transition-colors ${
                    userFilter === f
                      ? 'bg-red-500/15 text-red-400 border border-red-500/30'
                      : 'bg-cyber-card text-gray-400 border border-gray-800 hover:text-gray-200'
                  }`}
                >
                  {f === '' ? '전체' : f === 'admin' ? '관리자' : f === 'premium' ? 'PRO' : '차단'}
                </button>
              ))}
            </div>
          </div>

          {/* User Table */}
          <div className="bg-cyber-card border border-gray-800 rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-cyber-darker text-gray-400 text-xs uppercase">
                  <tr>
                    <th className="px-4 py-3">닉네임</th>
                    <th className="px-4 py-3">이메일</th>
                    <th className="px-4 py-3">계정</th>
                    <th className="px-4 py-3">구독</th>
                    <th className="px-4 py-3">권한</th>
                    <th className="px-4 py-3">상태</th>
                    <th className="px-4 py-3 text-center">관리</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                  {users.map(u => (
                    <tr key={u.id} className={`text-gray-300 ${u.is_banned ? 'opacity-50' : ''}`}>
                      <td className="px-4 py-3 font-medium">{u.nickname || '-'}</td>
                      <td className="px-4 py-3 text-xs text-gray-400">{u.email || '-'}</td>
                      <td className="px-4 py-3 text-xs">{u.provider}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          u.subscription_status === 'premium' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-gray-800 text-gray-500'
                        }`}>
                          {u.subscription_status === 'premium' ? 'PRO' : 'FREE'}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          u.role === 'admin' ? 'bg-red-500/20 text-red-400' : 'bg-gray-800 text-gray-500'
                        }`}>
                          {u.role.toUpperCase()}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        {u.is_banned && <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-900/50 text-red-300">차단됨</span>}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => handleRoleChange(u.id, u.role)}
                            className="p-1.5 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 rounded transition-colors"
                            title={u.role === 'admin' ? '일반 유저로 변경' : '관리자로 변경'}
                          >
                            <Shield className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleBan(u.id, u.is_banned)}
                            className={`p-1.5 rounded transition-colors ${
                              u.is_banned 
                                ? 'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400' 
                                : 'bg-red-500/10 hover:bg-red-500/20 text-red-400'
                            }`}
                            title={u.is_banned ? '차단 해제' : '차단'}
                          >
                            <Ban className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="px-4 py-3 bg-cyber-darker text-xs text-gray-500 border-t border-gray-800">
              총 {users.length}명
            </div>
          </div>
        </div>
      )}

      {/* ═══ POSTS TAB ═══ */}
      {activeTab === 'posts' && (
        <div className="space-y-4">
          {/* Post Search Bar */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 flex items-center bg-cyber-darker rounded-lg px-4 py-2 border border-gray-800">
              <Search className="w-4 h-4 text-gray-500 mr-2" />
              <input
                type="text"
                placeholder="제목, 내용 또는 작성자 검색..."
                value={postSearchQuery}
                onChange={(e) => setPostSearchQuery(e.target.value)}
                className="bg-transparent border-none outline-none text-sm w-full text-gray-200"
              />
            </div>
          </div>

          <div className="bg-cyber-card border border-gray-800 rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-cyber-darker text-gray-400 text-xs uppercase">
                  <tr>
                    <th className="px-4 py-3">제목</th>
                    <th className="px-4 py-3">작성자</th>
                    <th className="px-4 py-3">카테고리</th>
                    <th className="px-4 py-3 text-center">좋아요</th>
                    <th className="px-4 py-3 text-center">조회</th>
                    <th className="px-4 py-3">상태</th>
                    <th className="px-4 py-3 text-center">관리</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                  {((Array.isArray(posts) ? posts : []).filter(p => {
                    if (!postSearchQuery) return true;
                    const q = postSearchQuery.toLowerCase();
                    return (p.title && p.title.toLowerCase().includes(q)) ||
                           (p.nickname && p.nickname.toLowerCase().includes(q)) ||
                           (p.content && p.content.toLowerCase().includes(q));
                  })).map(p => (
                    <tr key={p.id} className={`text-gray-300 ${p.is_hidden ? 'opacity-50' : ''}`}>
                      <td className="px-4 py-3 truncate max-w-[200px] cursor-pointer hover:text-cyber-accent font-medium" onClick={() => navigate(`/community/${p.id}`)}>
                        {p.title}
                      </td>
                      <td className="px-4 py-3 text-xs">{p.nickname || '익명'}</td>
                      <td className="px-4 py-3">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-gray-800 text-gray-400">{p.category || 'free'}</span>
                      </td>
                      <td className="px-4 py-3 text-center text-xs">{p.likes}</td>
                      <td className="px-4 py-3 text-center text-xs">{p.views}</td>
                      <td className="px-4 py-3">
                        {p.is_hidden && <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-yellow-500/20 text-yellow-400">숨김</span>}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => handleToggleHide(p.id, p.is_hidden)}
                            className={`p-1.5 rounded transition-colors ${
                              p.is_hidden 
                                ? 'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400' 
                                : 'bg-yellow-500/10 hover:bg-yellow-500/20 text-yellow-400'
                            }`}
                            title={p.is_hidden ? '숨김 해제' : '숨기기'}
                          >
                            {p.is_hidden ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                          </button>
                          <button 
                            onClick={() => handleDeletePost(p.id)} 
                            className="p-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded transition-colors" 
                            title="삭제"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="px-4 py-3 bg-cyber-darker text-xs text-gray-500 border-t border-gray-800">
              총 {((Array.isArray(posts) ? posts : []).filter(p => {
                if (!postSearchQuery) return true;
                const q = postSearchQuery.toLowerCase();
                return (p.title && p.title.toLowerCase().includes(q)) ||
                       (p.nickname && p.nickname.toLowerCase().includes(q)) ||
                       (p.content && p.content.toLowerCase().includes(q));
              })).length}개 게시물
            </div>
          </div>
        </div>
      )}

      {/* ─── Custom Confirm Modal ─── */}
      {confirmModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animation-fade-in" role="dialog" aria-modal="true">
          <div className="bg-cyber-card border border-gray-700 p-6 rounded-xl max-w-sm w-full space-y-4 shadow-[0_0_30px_rgba(239,68,68,0.15)]">
            <h3 className="text-lg font-bold text-white">{confirmModal.title}</h3>
            <p className="text-sm text-gray-300">{confirmModal.message}</p>
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setConfirmModal({ ...confirmModal, isOpen: false })}
                className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg text-sm transition-colors"
              >
                취소
              </button>
              <button
                onClick={() => {
                  confirmModal.onConfirm();
                  setConfirmModal({ ...confirmModal, isOpen: false });
                }}
                className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg text-sm font-semibold transition-colors"
              >
                확인
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
