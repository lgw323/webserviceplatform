import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldAlert, Users, Trash2, Database, TrendingUp, Cpu, Loader2 } from 'lucide-react';
import * as api from '../api/apiClient';
import useAuthStore from '../store/useAuthStore';

export default function AdminDashboard() {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

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
        api.getAdminUsers(),
        api.getPosts()
      ]);
      setStats(statsData);
      setUsers(usersData);
      setPosts(postsData);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeletePost = async (id) => {
    if (!window.confirm('정말 이 게시글을 삭제하시겠습니까?')) return;
    try {
      await api.deletePostByAdmin(id);
      fetchData();
    } catch (err) {
      alert(err.message || '삭제 실패');
    }
  };

  if (isLoading) {
    return <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-cyber-accent" /></div>;
  }

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 animation-fade-in">
      <div className="flex items-center gap-3 border-b border-red-900/30 pb-4">
        <ShieldAlert className="w-8 h-8 text-cyber-danger" />
        <div>
          <h1 className="text-3xl font-black text-white">ADMIN DASHBOARD</h1>
          <p className="text-red-400 text-sm">운영 및 관리 시스템</p>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-cyber-card border border-red-900/50 p-6 rounded-xl">
          <div className="flex items-center gap-2 text-gray-400 mb-2"><Users className="w-4 h-4" /> 총 가입 유저</div>
          <div className="text-3xl font-bold text-white">{stats?.totalUsers || 0} 명</div>
        </div>
        <div className="bg-cyber-card border border-red-900/50 p-6 rounded-xl">
          <div className="flex items-center gap-2 text-yellow-500 mb-2"><TrendingUp className="w-4 h-4" /> PRO 유저 비율</div>
          <div className="text-3xl font-bold text-yellow-500">
            {stats?.totalUsers ? Math.round((stats.premiumUsers / stats.totalUsers) * 100) : 0}%
          </div>
        </div>
        <div className="bg-cyber-card border border-red-900/50 p-6 rounded-xl">
          <div className="flex items-center gap-2 text-blue-400 mb-2"><Database className="w-4 h-4" /> 총 게시물</div>
          <div className="text-3xl font-bold text-white">{stats?.totalPosts || 0} 개</div>
        </div>
        <div className="bg-cyber-card border border-red-900/50 p-6 rounded-xl">
          <div className="flex items-center gap-2 text-green-400 mb-2"><Cpu className="w-4 h-4" /> 누적 최적화 프로필</div>
          <div className="text-3xl font-bold text-white">{stats?.totalOptimizations || 0} 개</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* User Management */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-white">최근 가입 유저</h2>
          <div className="bg-cyber-card border border-gray-800 rounded-xl overflow-hidden">
            <table className="w-full text-sm text-left">
              <thead className="bg-cyber-darker text-gray-400">
                <tr>
                  <th className="px-4 py-3">닉네임</th>
                  <th className="px-4 py-3">계정</th>
                  <th className="px-4 py-3">권한</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {users.slice(0, 10).map(u => (
                  <tr key={u.id} className="text-gray-300">
                    <td className="px-4 py-3">{u.nickname}</td>
                    <td className="px-4 py-3">{u.provider}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded text-xs ${u.role === 'admin' ? 'bg-red-500/20 text-red-400' : 'bg-gray-800'}`}>
                        {u.role.toUpperCase()}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Content Moderation */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-white">게시물 모니터링</h2>
          <div className="bg-cyber-card border border-gray-800 rounded-xl overflow-hidden">
            <table className="w-full text-sm text-left">
              <thead className="bg-cyber-darker text-gray-400">
                <tr>
                  <th className="px-4 py-3">제목</th>
                  <th className="px-4 py-3">작성자</th>
                  <th className="px-4 py-3 text-center">관리</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {posts.slice(0, 10).map(p => (
                  <tr key={p.id} className="text-gray-300">
                    <td className="px-4 py-3 truncate max-w-[150px] cursor-pointer hover:text-cyber-accent" onClick={() => navigate(`/community/${p.id}`)}>
                      {p.title}
                    </td>
                    <td className="px-4 py-3 text-xs">{p.nickname}</td>
                    <td className="px-4 py-3 text-center">
                      <button onClick={() => handleDeletePost(p.id)} className="p-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded transition-colors" aria-label="삭제">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
