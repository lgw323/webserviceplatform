import { db } from '../config/db.js';

export const getPosts = async (req, res, next) => {
  try {
    const result = await db.query('SELECT p.*, u.nickname FROM posts p JOIN users u ON p.user_id = u.id ORDER BY p.created_at DESC');
    res.json({ status: 'success', data: result.rows });
  } catch (err) {
    next(err);
  }
};

export const getPostById = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    // Increase view count
    await db.query('UPDATE posts SET views = views + 1 WHERE id = $1', [id]);
    
    const postRes = await db.query('SELECT p.*, u.nickname FROM posts p JOIN users u ON p.user_id = u.id WHERE p.id = $1', [id]);
    if (postRes.rows.length === 0) {
      return res.status(404).json({ status: 'error', message: '게시글을 찾을 수 없습니다.' });
    }
    
    const commentsRes = await db.query('SELECT c.*, u.nickname FROM comments c JOIN users u ON c.user_id = u.id WHERE c.post_id = $1 ORDER BY c.created_at ASC', [id]);
    
    res.json({ status: 'success', data: { ...postRes.rows[0], comments: commentsRes.rows } });
  } catch (err) {
    next(err);
  }
};

export const createPost = async (req, res, next) => {
  try {
    const { title, content } = req.body;
    const userId = req.user.id;
    if (!title || !content) return res.status(400).json({ status: 'error', message: '제목과 내용을 입력해주세요.' });

    const result = await db.query(
      'INSERT INTO posts (user_id, title, content) VALUES ($1, $2, $3) RETURNING *',
      [userId, title, content]
    );
    res.status(201).json({ status: 'success', data: result.rows[0] });
  } catch (err) {
    next(err);
  }
};

export const createComment = async (req, res, next) => {
  try {
    const { id } = req.params; // post id
    const { content } = req.body;
    const userId = req.user.id;
    if (!content) return res.status(400).json({ status: 'error', message: '댓글 내용을 입력해주세요.' });

    const result = await db.query(
      'INSERT INTO comments (post_id, user_id, content) VALUES ($1, $2, $3) RETURNING *',
      [id, userId, content]
    );
    res.status(201).json({ status: 'success', data: result.rows[0] });
  } catch (err) {
    next(err);
  }
};
