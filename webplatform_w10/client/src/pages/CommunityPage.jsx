import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageSquare, ThumbsUp, Eye, Plus, Loader2 } from 'lucide-react';
import * as api from '../api/apiClient';

export default function CommunityPage() {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const data = await api.getPosts();
      setPosts(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!newTitle || !newContent) return;
    try {
      await api.createPost(newTitle, newContent);
      setIsCreating(false);
      setNewTitle('');
      setNewContent('');
      fetchPosts();
    } catch (err) {
      alert(err.message || '게시글 작성에 실패했습니다.');
    }
  };

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-6 animation-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black bg-clip-text text-transparent bg-gradient-to-r from-cyber-accent to-cyber-purple">COMMUNITY</h1>
          <p className="text-a11y-muted mt-1">유저들과 최적화 정보 및 질문을 공유하세요.</p>
        </div>
        <button 
          onClick={() => setIsCreating(!isCreating)}
          className="flex items-center gap-2 px-4 py-2 bg-cyber-accent hover:bg-blue-600 text-white rounded-lg transition-colors shadow-lg shadow-blue-500/20"
        >
          <Plus className="w-4 h-4" />
          새 글 작성
        </button>
      </div>

      {isCreating && (
        <form onSubmit={handleCreate} className="bg-cyber-card border border-gray-800 p-6 rounded-xl space-y-4 shadow-lg animation-fade-in">
          <input
            type="text"
            placeholder="제목을 입력하세요"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            className="w-full bg-cyber-darker border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-cyber-accent"
          />
          <textarea
            placeholder="내용을 입력하세요"
            value={newContent}
            onChange={(e) => setNewContent(e.target.value)}
            rows={5}
            className="w-full bg-cyber-darker border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-cyber-accent resize-none"
          />
          <div className="flex justify-end gap-2">
            <button type="button" onClick={() => setIsCreating(false)} className="px-4 py-2 text-gray-400 hover:text-white transition-colors">취소</button>
            <button type="submit" className="px-4 py-2 bg-cyber-accent hover:bg-blue-600 text-white rounded-lg transition-colors">등록</button>
          </div>
        </form>
      )}

      {isLoading ? (
        <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-cyber-accent" /></div>
      ) : (
        <div className="space-y-3">
          {posts.map(post => (
            <div 
              key={post.id} 
              onClick={() => navigate(`/community/${post.id}`)}
              className="bg-cyber-card border border-gray-800 hover:border-gray-600 p-5 rounded-xl cursor-pointer transition-all hover:shadow-lg group"
            >
              <h2 className="text-lg font-bold text-gray-100 group-hover:text-cyber-accent transition-colors">{post.title}</h2>
              <div className="flex items-center gap-4 mt-3 text-xs text-gray-400">
                <span className="text-gray-300 font-medium">{post.nickname || '익명'}</span>
                <span>{new Date(post.created_at).toLocaleDateString()}</span>
                <span className="flex items-center gap-1"><Eye className="w-3.5 h-3.5" /> {post.views}</span>
                <span className="flex items-center gap-1"><ThumbsUp className="w-3.5 h-3.5" /> {post.likes}</span>
              </div>
            </div>
          ))}
          {posts.length === 0 && (
            <div className="text-center py-12 text-gray-500">작성된 게시글이 없습니다.</div>
          )}
        </div>
      )}
    </div>
  );
}
