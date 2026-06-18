import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Loader2 } from 'lucide-react';
import * as api from '../api/apiClient';
import toast from 'react-hot-toast';

const CATEGORIES = [
  { key: 'free', label: '자유 게시판', emoji: '💬' },
  { key: 'tips', label: '팁 공유', emoji: '💡' },
  { key: 'hardware', label: '하드웨어', emoji: '🖥️' },
  { key: 'bug', label: '버그 리포트', emoji: '🐛' },
];

export default function PostWritePage() {
  const { id } = useParams(); // edit mode if id exists
  const navigate = useNavigate();
  const isEdit = !!id;

  const [category, setCategory] = useState('free');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(isEdit);

  useEffect(() => {
    if (isEdit) {
      fetchPost();
    }
  }, [id]);

  const fetchPost = async () => {
    try {
      const data = await api.getPostById(id);
      setTitle(data.title);
      setContent(data.content);
      setCategory(data.category || 'free');
    } catch (err) {
      toast.error('게시글을 불러올 수 없습니다.');
      navigate('/community');
    } finally {
      setIsFetching(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      toast.error('제목과 내용을 모두 입력해주세요.');
      return;
    }
    setIsLoading(true);
    try {
      if (isEdit) {
        await api.updatePost(id, title, content, category);
        toast.success('게시글이 수정되었습니다.');
      } else {
        await api.createPost(title, content, category);
        toast.success('게시글이 등록되었습니다.');
      }
      navigate('/community');
    } catch (err) {
      toast.error(err.message || '게시글 작성에 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetching) {
    return <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-cyber-accent" /></div>;
  }

  return (
    <div className="p-6 lg:p-8 max-w-3xl mx-auto space-y-6 animation-fade-in">
      <button onClick={() => navigate('/community')} className="flex items-center gap-2 text-a11y-muted hover:text-white transition-colors text-sm">
        <ArrowLeft className="w-4 h-4" /> 커뮤니티로 돌아가기
      </button>

      <div className="bg-cyber-card border border-gray-800 rounded-xl p-8">
        <h1 className="text-2xl font-bold text-white mb-6">{isEdit ? '게시글 수정' : '새 글 작성'}</h1>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Category Selection */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-a11y-muted uppercase tracking-wider">카테고리</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {CATEGORIES.map(cat => (
                <button
                  key={cat.key}
                  type="button"
                  onClick={() => setCategory(cat.key)}
                  className={`flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-lg text-sm font-medium transition-all border ${
                    category === cat.key
                      ? 'bg-cyber-accent/15 text-cyber-accent border-cyber-accent/40'
                      : 'bg-cyber-darker text-gray-400 border-gray-700 hover:border-gray-600'
                  }`}
                >
                  <span>{cat.emoji}</span>
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Title */}
          <div className="space-y-2">
            <label htmlFor="post-title" className="text-xs font-semibold text-a11y-muted uppercase tracking-wider">제목</label>
            <input
              id="post-title"
              type="text"
              placeholder="제목을 입력하세요"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={200}
              className="w-full bg-cyber-darker border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-cyber-accent transition-colors"
            />
          </div>

          {/* Content */}
          <div className="space-y-2">
            <label htmlFor="post-content" className="text-xs font-semibold text-a11y-muted uppercase tracking-wider">내용</label>
            <textarea
              id="post-content"
              placeholder="내용을 입력하세요..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={12}
              className="w-full bg-cyber-darker border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-cyber-accent transition-colors resize-none"
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-2">
            <button 
              type="button" 
              onClick={() => navigate('/community')} 
              className="px-5 py-2.5 text-gray-400 hover:text-white bg-cyber-dark hover:bg-gray-700 rounded-lg transition-colors font-medium border border-gray-700"
            >
              취소
            </button>
            <button 
              type="submit" 
              disabled={isLoading}
              className="px-6 py-2.5 bg-cyber-accent hover:bg-blue-600 text-white rounded-lg transition-colors font-medium shadow-lg shadow-blue-500/20 disabled:opacity-50 flex items-center gap-2"
            >
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
              {isEdit ? '수정 완료' : '게시글 등록'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
