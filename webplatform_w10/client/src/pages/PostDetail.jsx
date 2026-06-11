import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, User, Calendar, Eye, ThumbsUp, MessageSquare, Loader2, Send } from 'lucide-react';
import * as api from '../api/apiClient';
import useAuthStore from '../store/useAuthStore';

export default function PostDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [post, setPost] = useState(null);
  const [newComment, setNewComment] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchPost();
  }, [id]);

  const fetchPost = async () => {
    try {
      const data = await api.getPostById(id);
      setPost(data);
    } catch (err) {
      alert('게시글을 불러올 수 없습니다.');
      navigate('/community');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    try {
      await api.createComment(id, newComment);
      setNewComment('');
      fetchPost();
    } catch (err) {
      alert(err.message || '댓글 작성에 실패했습니다.');
    }
  };

  if (isLoading) {
    return <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-cyber-accent" /></div>;
  }

  if (!post) return null;

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-6 animation-fade-in">
      <button onClick={() => navigate('/community')} className="flex items-center gap-2 text-a11y-muted hover:text-white transition-colors">
        <ArrowLeft className="w-4 h-4" /> 목록으로
      </button>

      {/* Post Header */}
      <div className="bg-cyber-card border border-gray-800 rounded-xl p-8 space-y-6">
        <h1 className="text-3xl font-bold text-white">{post.title}</h1>
        <div className="flex flex-wrap items-center gap-6 text-sm text-gray-400 border-b border-gray-800 pb-6">
          <span className="flex items-center gap-1.5"><User className="w-4 h-4 text-cyber-accent" /> {post.nickname || '익명'}</span>
          <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4" /> {new Date(post.created_at).toLocaleString()}</span>
          <span className="flex items-center gap-1.5"><Eye className="w-4 h-4" /> {post.views}</span>
          <span className="flex items-center gap-1.5"><ThumbsUp className="w-4 h-4" /> {post.likes}</span>
        </div>

        {/* Post Content */}
        <div className="text-gray-200 leading-relaxed whitespace-pre-wrap min-h-[200px]">
          {post.content}
        </div>
      </div>

      {/* Comments Section */}
      <div className="space-y-4">
        <h3 className="text-xl font-bold text-white flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-cyber-accent" /> 댓글 {post.comments?.length || 0}
        </h3>

        {/* Comment Form */}
        {user ? (
          <form onSubmit={handleCommentSubmit} className="flex gap-2">
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="댓글을 입력하세요..."
              className="flex-1 bg-cyber-darker border border-gray-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-cyber-accent"
            />
            <button type="submit" className="px-6 py-3 bg-cyber-accent hover:bg-blue-600 text-white rounded-lg transition-colors flex items-center gap-2">
              <Send className="w-4 h-4" /> 등록
            </button>
          </form>
        ) : (
          <div className="bg-cyber-darker border border-gray-800 rounded-lg p-4 text-center text-gray-500 text-sm">
            로그인 후 댓글을 작성할 수 있습니다.
          </div>
        )}

        {/* Comment List */}
        <div className="space-y-3">
          {post.comments?.map(comment => (
            <div key={comment.id} className="bg-cyber-card border border-gray-800 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-sm text-gray-200">{comment.nickname || '익명'}</span>
                <span className="text-xs text-gray-500">{new Date(comment.created_at).toLocaleString()}</span>
              </div>
              <p className="text-sm text-gray-300 whitespace-pre-wrap">{comment.content}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
