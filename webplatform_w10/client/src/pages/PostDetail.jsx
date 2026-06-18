import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, User, Calendar, Eye, ThumbsUp, MessageSquare, Loader2, Send, Edit3, Trash2 } from 'lucide-react';
import * as api from '../api/apiClient';
import useAuthStore from '../store/useAuthStore';
import toast from 'react-hot-toast';

const CATEGORY_BADGES = {
  free: { label: '자유', color: 'bg-gray-700 text-gray-300' },
  tips: { label: '팁 공유', color: 'bg-emerald-500/20 text-emerald-400' },
  hardware: { label: '하드웨어', color: 'bg-blue-500/20 text-blue-400' },
  bug: { label: '버그 리포트', color: 'bg-red-500/20 text-red-400' },
};

export default function PostDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [post, setPost] = useState(null);
  const [newComment, setNewComment] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isLiking, setIsLiking] = useState(false);
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: null
  });

  useEffect(() => {
    fetchPost();
  }, [id]);

  const fetchPost = async () => {
    try {
      const data = await api.getPostById(id);
      setPost(data);
    } catch (err) {
      toast.error('게시글을 불러올 수 없습니다.');
      navigate('/community');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLike = async () => {
    if (!user) {
      toast.error('로그인이 필요합니다.');
      return;
    }
    if (isLiking) return;
    setIsLiking(true);
    try {
      const result = await api.togglePostLike(id);
      setPost(prev => ({
        ...prev,
        likes: result.liked ? prev.likes + 1 : prev.likes - 1,
        user_liked: result.liked
      }));
    } catch (err) {
      console.error(err);
    } finally {
      setIsLiking(false);
    }
  };

  const handleDelete = () => {
    setConfirmModal({
      isOpen: true,
      title: '게시글 삭제',
      message: '정말 이 게시글을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.',
      onConfirm: async () => {
        try {
          await api.deletePost(id);
          toast.success('게시글이 삭제되었습니다.');
          navigate('/community');
        } catch (err) {
          toast.error(err.message || '삭제에 실패했습니다.');
        }
      }
    });
  };

  const handleDeleteComment = (commentId) => {
    setConfirmModal({
      isOpen: true,
      title: '댓글 삭제',
      message: '이 댓글을 삭제하시겠습니까?',
      onConfirm: async () => {
        try {
          await api.deleteComment(commentId);
          toast.success('댓글이 삭제되었습니다.');
          fetchPost();
        } catch (err) {
          toast.error(err.message || '댓글 삭제에 실패했습니다.');
        }
      }
    });
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    try {
      await api.createComment(id, newComment);
      setNewComment('');
      toast.success('댓글이 등록되었습니다.');
      fetchPost();
    } catch (err) {
      toast.error(err.message || '댓글 작성에 실패했습니다.');
    }
  };

  if (isLoading) {
    return <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-cyber-accent" /></div>;
  }

  if (!post) return null;

  const isOwner = user?.id === post.user_id;
  const isAdmin = user?.role === 'admin';
  const badge = CATEGORY_BADGES[post.category] || CATEGORY_BADGES.free;

  return (
    <div className="p-6 lg:p-8 max-w-4xl mx-auto space-y-6 animation-fade-in">
      <button onClick={() => navigate('/community')} className="flex items-center gap-2 text-a11y-muted hover:text-white transition-colors text-sm">
        <ArrowLeft className="w-4 h-4" /> 목록으로
      </button>

      {/* Post Header */}
      <div className="bg-cyber-card border border-gray-800 rounded-xl p-8 space-y-6">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <span className={`px-2.5 py-1 rounded text-xs font-bold ${badge.color}`}>{badge.label}</span>
          </div>
          <h1 className="text-2xl lg:text-3xl font-bold text-white">{post.title}</h1>
        </div>
        
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-800 pb-6">
          <div className="flex flex-wrap items-center gap-5 text-sm text-gray-400">
            <span className="flex items-center gap-1.5"><User className="w-4 h-4 text-cyber-accent" /> {post.nickname || '익명'}</span>
            <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4" /> {new Date(post.created_at).toLocaleString()}</span>
            <span className="flex items-center gap-1.5"><Eye className="w-4 h-4" /> {post.views}</span>
          </div>
          {(isOwner || isAdmin) && (
            <div className="flex items-center gap-2">
              {isOwner && (
                <button 
                  onClick={() => navigate(`/community/edit/${id}`)} 
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-cyber-dark hover:bg-gray-700 text-gray-300 rounded-lg transition-colors border border-gray-700"
                >
                  <Edit3 className="w-3.5 h-3.5" /> 수정
                </button>
              )}
              <button 
                onClick={handleDelete}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg transition-colors border border-red-500/20"
              >
                <Trash2 className="w-3.5 h-3.5" /> 삭제
              </button>
            </div>
          )}
        </div>

        {/* Post Content */}
        <div className="text-gray-200 leading-relaxed whitespace-pre-wrap min-h-[150px]">
          {post.content}
        </div>

        {/* Like Button */}
        <div className="flex justify-center pt-4 border-t border-gray-800">
          <button 
            onClick={handleLike} 
            disabled={isLiking}
            className={`flex items-center gap-2 px-6 py-3 rounded-full font-bold transition-all ${
              post.user_liked 
                ? 'bg-cyber-accent/20 text-cyber-accent border border-cyber-accent/40 shadow-lg shadow-blue-500/10' 
                : 'bg-cyber-dark text-gray-400 border border-gray-700 hover:border-gray-600 hover:text-gray-200'
            }`}
          >
            <ThumbsUp className={`w-5 h-5 ${post.user_liked ? 'fill-current' : ''}`} />
            좋아요 {post.likes}
          </button>
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
              className="flex-1 bg-cyber-darker border border-gray-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-cyber-accent transition-colors"
            />
            <button type="submit" className="px-6 py-3 bg-cyber-accent hover:bg-blue-600 text-white rounded-lg transition-colors flex items-center gap-2 font-medium">
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
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm text-gray-200">{comment.nickname || '익명'}</span>
                  <span className="text-xs text-gray-500">{new Date(comment.created_at).toLocaleString()}</span>
                </div>
                {(user?.id === comment.user_id || isAdmin) && (
                  <button 
                    onClick={() => handleDeleteComment(comment.id)}
                    className="p-1 text-gray-600 hover:text-red-400 transition-colors"
                    aria-label="댓글 삭제"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
              <p className="text-sm text-gray-300 whitespace-pre-wrap">{comment.content}</p>
            </div>
          ))}
        </div>
      </div>

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
