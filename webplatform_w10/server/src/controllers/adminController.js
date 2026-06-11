import { db } from '../config/db.js';

export const getStats = async (req, res, next) => {
  try {
    const usersRes = await db.query('SELECT id, role, subscription_status FROM users');
    const users = usersRes.rows || [];
    
    const postsRes = await db.query('SELECT id FROM posts');
    const postsCount = postsRes.rows ? postsRes.rows.length : 0;
    
    const optRes = await db.query('SELECT id FROM optimization_profiles');
    const optCount = optRes.rows ? optRes.rows.length : 0;

    const stats = {
      totalUsers: users.length,
      premiumUsers: users.filter(u => u.subscription_status === 'premium').length,
      adminUsers: users.filter(u => u.role === 'admin').length,
      totalPosts: postsCount,
      totalOptimizations: optCount
    };

    res.json({ status: 'success', data: stats });
  } catch (err) {
    next(err);
  }
};

export const getUsers = async (req, res, next) => {
  try {
    const result = await db.query('SELECT id, email, nickname, provider, role, subscription_status, created_at FROM users ORDER BY created_at DESC');
    res.json({ status: 'success', data: result.rows || [] });
  } catch (err) {
    next(err);
  }
};

export const deletePost = async (req, res, next) => {
  try {
    const { id } = req.params;
    await db.query('DELETE FROM posts WHERE id = $1', [id]);
    res.json({ status: 'success', message: '게시글이 삭제되었습니다.' });
  } catch (err) {
    next(err);
  }
};

export const deleteComment = async (req, res, next) => {
  try {
    const { id } = req.params;
    await db.query('DELETE FROM comments WHERE id = $1', [id]);
    res.json({ status: 'success', message: '댓글이 삭제되었습니다.' });
  } catch (err) {
    next(err);
  }
};
