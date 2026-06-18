import { db } from '../config/db.js';

// ─── 게시글 목록 (카테고리, 페이지네이션, 정렬) ───
export const getPosts = async (req, res, next) => {
  try {
    const { category, page = 1, limit = 10, sort = 'latest' } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(limit);

    let result;
    if (category && category !== 'all') {
      result = await db.query(
        'SELECT p.*, u.nickname FROM posts p JOIN users u ON p.user_id = u.id WHERE p.is_hidden = false AND p.category = $1 ORDER BY p.is_pinned DESC, p.created_at DESC LIMIT $2 OFFSET $3',
        [category, parseInt(limit), offset]
      );
    } else {
      result = await db.query(
        'SELECT p.*, u.nickname FROM posts p JOIN users u ON p.user_id = u.id WHERE p.is_hidden = false ORDER BY p.is_pinned DESC, p.created_at DESC LIMIT $1 OFFSET $2',
        [parseInt(limit), offset]
      );
    }

    // Sort by popularity if requested
    let rows = result.rows || [];
    if (sort === 'popular') {
      rows = rows.sort((a, b) => b.likes - a.likes);
    }

    res.json({ 
      status: 'success', 
      data: rows,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: result.totalCount || rows.length
      }
    });
  } catch (err) {
    next(err);
  }
};

// ─── 게시글 상세 (댓글 포함) ───
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
    
    // Check if current user has liked
    let userLiked = false;
    const authHeader = req.headers.authorization;
    if (authHeader) {
      try {
        const jwt = await import('jsonwebtoken');
        const token = authHeader.split(' ')[1];
        const decoded = jwt.default.verify(token, process.env.JWT_SECRET || 'syncrig_dev_fallback_key');
        const likeCheck = await db.query('SELECT * FROM post_likes WHERE post_id = $1 AND user_id = $2', [id, decoded.id]);
        userLiked = likeCheck.rows.length > 0;
      } catch (e) { /* not logged in or invalid token */ }
    }

    res.json({ status: 'success', data: { ...postRes.rows[0], comments: commentsRes.rows, user_liked: userLiked } });
  } catch (err) {
    next(err);
  }
};

// ─── 게시글 작성 ───
export const createPost = async (req, res, next) => {
  try {
    const { title, content, category = 'free' } = req.body;
    const userId = req.user.id;
    if (!title || !content) return res.status(400).json({ status: 'error', message: '제목과 내용을 입력해주세요.' });

    const validCategories = ['free', 'tips', 'hardware', 'bug'];
    const safeCategory = validCategories.includes(category) ? category : 'free';

    const result = await db.query(
      'INSERT INTO posts (user_id, category, title, content) VALUES ($1, $2, $3, $4) RETURNING *',
      [userId, safeCategory, title, content]
    );
    res.status(201).json({ status: 'success', data: result.rows[0] });
  } catch (err) {
    next(err);
  }
};

// ─── 게시글 수정 (작성자 본인만) ───
export const updatePost = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, content, category } = req.body;
    const userId = req.user.id;

    // Check ownership
    const existing = await db.query('SELECT * FROM posts WHERE id = $1', [id]);
    const post = existing.rows[0];
    if (!post) return res.status(404).json({ status: 'error', message: '게시글을 찾을 수 없습니다.' });
    if (post.user_id !== userId && req.user.role !== 'admin') {
      return res.status(403).json({ status: 'error', message: '수정 권한이 없습니다.' });
    }

    const validCategories = ['free', 'tips', 'hardware', 'bug'];
    const safeCategory = validCategories.includes(category) ? category : post.category;

    const result = await db.query(
      'UPDATE posts SET title = $1, content = $2, category = $3, updated_at = $4 WHERE id = $5 RETURNING *',
      [title || post.title, content || post.content, safeCategory, new Date(), id]
    );

    res.json({ status: 'success', data: result.rows[0] });
  } catch (err) {
    next(err);
  }
};

// ─── 게시글 삭제 (작성자 본인 또는 admin) ───
export const deletePost = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const existing = await db.query('SELECT * FROM posts WHERE id = $1', [id]);
    const post = existing.rows[0];
    if (!post) return res.status(404).json({ status: 'error', message: '게시글을 찾을 수 없습니다.' });
    if (post.user_id !== userId && req.user.role !== 'admin') {
      return res.status(403).json({ status: 'error', message: '삭제 권한이 없습니다.' });
    }

    await db.query('DELETE FROM posts WHERE id = $1', [id]);
    res.json({ status: 'success', message: '게시글이 삭제되었습니다.' });
  } catch (err) {
    next(err);
  }
};

// ─── 좋아요 토글 ───
export const toggleLike = async (req, res, next) => {
  try {
    const { id } = req.params; // post id
    const userId = req.user.id;

    // Check if already liked
    const existing = await db.query('SELECT * FROM post_likes WHERE post_id = $1 AND user_id = $2', [id, userId]);

    if (existing.rows.length > 0) {
      // Unlike
      await db.query('DELETE FROM post_likes WHERE post_id = $1 AND user_id = $2', [id, userId]);
      await db.query('UPDATE posts SET likes = likes - 1 WHERE id = $1', [id]);
      res.json({ status: 'success', data: { liked: false } });
    } else {
      // Like
      await db.query('INSERT INTO post_likes (post_id, user_id) VALUES ($1, $2)', [id, userId]);
      await db.query('UPDATE posts SET likes = likes + 1 WHERE id = $1', [id]);
      res.json({ status: 'success', data: { liked: true } });
    }
  } catch (err) {
    next(err);
  }
};

// ─── 댓글 작성 ───
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

// ─── 댓글 삭제 (작성자 본인 또는 admin) ───
export const deleteComment = async (req, res, next) => {
  try {
    const { commentId } = req.params;
    const userId = req.user.id;

    const existing = await db.query('SELECT * FROM comments WHERE id = $1', [commentId]);
    const comment = existing.rows[0];
    if (!comment) return res.status(404).json({ status: 'error', message: '댓글을 찾을 수 없습니다.' });
    if (comment.user_id !== userId && req.user.role !== 'admin') {
      return res.status(403).json({ status: 'error', message: '삭제 권한이 없습니다.' });
    }

    await db.query('DELETE FROM comments WHERE id = $1', [commentId]);
    res.json({ status: 'success', message: '댓글이 삭제되었습니다.' });
  } catch (err) {
    next(err);
  }
};
