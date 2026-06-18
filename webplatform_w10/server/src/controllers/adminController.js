import { db } from '../config/db.js';

// ─── 대시보드 통계 ───
export const getStats = async (req, res, next) => {
  try {
    const usersRes = await db.query('SELECT id, role, subscription_status, is_banned, created_at FROM users');
    const users = usersRes.rows || [];
    
    const postsRes = await db.query('SELECT id, category, created_at FROM posts');
    const posts = postsRes.rows || [];
    
    const optRes = await db.query('SELECT id FROM optimization_profiles');
    const optCount = optRes.rows ? optRes.rows.length : 0;

    // 일별 가입자 추이 (최근 14일)
    const dailySignups = [];
    for (let i = 13; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      const count = users.filter(u => {
        const d = new Date(u.created_at).toISOString().split('T')[0];
        return d === dateStr;
      }).length;
      dailySignups.push({ date: dateStr, count });
    }

    // 구독 티어 분포
    const subscriptionDistribution = [
      { name: 'Free', value: users.filter(u => u.subscription_status === 'free').length },
      { name: 'Premium', value: users.filter(u => u.subscription_status === 'premium').length }
    ];

    // 카테고리별 게시글 수
    const categoryDistribution = [
      { name: '자유', category: 'free', value: posts.filter(p => p.category === 'free').length },
      { name: '팁 공유', category: 'tips', value: posts.filter(p => p.category === 'tips').length },
      { name: '하드웨어', category: 'hardware', value: posts.filter(p => p.category === 'hardware').length },
      { name: '버그', category: 'bug', value: posts.filter(p => p.category === 'bug').length }
    ];

    // 전일 대비 변화
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const newUsersToday = users.filter(u => new Date(u.created_at) >= yesterday).length;

    const stats = {
      totalUsers: users.length,
      premiumUsers: users.filter(u => u.subscription_status === 'premium').length,
      adminUsers: users.filter(u => u.role === 'admin').length,
      bannedUsers: users.filter(u => u.is_banned).length,
      totalPosts: posts.length,
      totalOptimizations: optCount,
      newUsersToday,
      premiumRate: users.length > 0 ? Math.round((users.filter(u => u.subscription_status === 'premium').length / users.length) * 100) : 0,
      dailySignups,
      subscriptionDistribution,
      categoryDistribution
    };

    res.json({ status: 'success', data: stats });
  } catch (err) {
    next(err);
  }
};

// ─── 유저 목록 ───
export const getUsers = async (req, res, next) => {
  try {
    const { search, filter, page = 1, limit = 20, sort = 'latest' } = req.query;
    const parsedLimit = parseInt(limit, 10);
    const parsedPage = parseInt(page, 10);
    const offset = (parsedPage - 1) * parsedLimit;

    let totalCount = 0;
    let users = [];

    if (db.isPgActive()) {
      let queryText = 'SELECT id, email, nickname, provider, role, subscription_status, is_banned, email_verified, created_at FROM users WHERE 1=1';
      let countQueryText = 'SELECT COUNT(*) FROM users WHERE 1=1';
      const queryParams = [];
      const countQueryParams = [];
      let paramIndex = 1;

      if (search) {
        const searchPattern = `%${search}%`;
        const filterStr = ` AND (LOWER(email) LIKE LOWER($${paramIndex}) OR LOWER(nickname) LIKE LOWER($${paramIndex}))`;
        queryText += filterStr;
        countQueryText += filterStr;
        queryParams.push(searchPattern);
        countQueryParams.push(searchPattern);
        paramIndex++;
      }

      if (filter === 'admin') {
        queryText += ` AND role = 'admin'`;
        countQueryText += ` AND role = 'admin'`;
      } else if (filter === 'premium') {
        queryText += ` AND subscription_status = 'premium'`;
        countQueryText += ` AND subscription_status = 'premium'`;
      } else if (filter === 'banned') {
        queryText += ` AND is_banned = true`;
        countQueryText += ` AND is_banned = true`;
      }

      let orderBy = 'ORDER BY created_at DESC';
      if (sort === 'oldest') {
        orderBy = 'ORDER BY created_at ASC';
      } else if (sort === 'alphabetical') {
        orderBy = 'ORDER BY nickname ASC, created_at DESC';
      }

      queryText += ` ${orderBy} LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
      queryParams.push(parsedLimit, offset);

      const countRes = await db.query(countQueryText, countQueryParams);
      totalCount = parseInt(countRes.rows[0].count, 10);

      const usersRes = await db.query(queryText, queryParams);
      users = usersRes.rows || [];
    } else {
      const result = await db.query('SELECT id, email, nickname, provider, role, subscription_status, is_banned, email_verified, created_at FROM users ORDER BY created_at DESC');
      let allUsers = result.rows || [];

      if (search) {
        const q = search.toLowerCase();
        allUsers = allUsers.filter(u => 
          (u.email && u.email.toLowerCase().includes(q)) || 
          (u.nickname && u.nickname.toLowerCase().includes(q))
        );
      }
      if (filter === 'admin') allUsers = allUsers.filter(u => u.role === 'admin');
      if (filter === 'premium') allUsers = allUsers.filter(u => u.subscription_status === 'premium');
      if (filter === 'banned') allUsers = allUsers.filter(u => u.is_banned);

      if (sort === 'oldest') {
        allUsers.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
      } else if (sort === 'alphabetical') {
        allUsers.sort((a, b) => (a.nickname || '').localeCompare(b.nickname || ''));
      } else {
        allUsers.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      }

      totalCount = allUsers.length;
      users = allUsers.slice(offset, offset + parsedLimit);
    }

    res.json({ 
      status: 'success', 
      data: users,
      pagination: {
        page: parsedPage,
        limit: parsedLimit,
        total: totalCount
      }
    });
  } catch (err) {
    next(err);
  }
};

// ─── 유저 역할 변경 ───
export const updateUserRole = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { role } = req.body;
    if (!['user', 'admin'].includes(role)) {
      return res.status(400).json({ status: 'error', message: '유효하지 않은 역할입니다.' });
    }

    await db.query('UPDATE users SET role = $1 WHERE id = $2', [role, id]);
    res.json({ status: 'success', message: `유저 역할이 ${role}로 변경되었습니다.` });
  } catch (err) {
    next(err);
  }
};

// ─── 유저 차단/해제 ───
export const banUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { is_banned } = req.body;

    await db.query('UPDATE users SET is_banned = $1 WHERE id = $2', [!!is_banned, id]);
    res.json({ status: 'success', message: is_banned ? '유저가 차단되었습니다.' : '차단이 해제되었습니다.' });
  } catch (err) {
    next(err);
  }
};

// ─── 게시글 숨기기 ───
export const hidePost = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { is_hidden } = req.body;
    
    await db.query('UPDATE posts SET is_hidden = $1 WHERE id = $2', [!!is_hidden, id]);
    res.json({ status: 'success', message: is_hidden ? '게시글이 숨겨졌습니다.' : '숨김이 해제되었습니다.' });
  } catch (err) {
    next(err);
  }
};

// ─── 관리자 게시글 삭제 ───
export const deletePost = async (req, res, next) => {
  try {
    const { id } = req.params;
    await db.query('DELETE FROM posts WHERE id = $1', [id]);
    res.json({ status: 'success', message: '게시글이 삭제되었습니다.' });
  } catch (err) {
    next(err);
  }
};

// ─── 관리자 댓글 삭제 ───
export const deleteComment = async (req, res, next) => {
  try {
    const { id } = req.params;
    await db.query('DELETE FROM comments WHERE id = $1', [id]);
    res.json({ status: 'success', message: '댓글이 삭제되었습니다.' });
  } catch (err) {
    next(err);
  }
};

// ─── 비즈니스 지표 ───
export const getBusinessMetrics = async (req, res, next) => {
  try {
    const usersRes = await db.query('SELECT id, subscription_status, created_at FROM users');
    const users = usersRes.rows || [];
    const postsRes = await db.query('SELECT id, created_at FROM posts');
    const posts = postsRes.rows || [];

    // 일별 가입자 추이 (30일)
    const dailySignups = [];
    for (let i = 29; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      const count = users.filter(u => {
        const d = new Date(u.created_at).toISOString().split('T')[0];
        return d === dateStr;
      }).length;
      dailySignups.push({ date: dateStr, count });
    }

    // 일별 게시글 작성 추이 (30일)
    const dailyPosts = [];
    for (let i = 29; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      const count = posts.filter(p => {
        const d = new Date(p.created_at).toISOString().split('T')[0];
        return d === dateStr;
      }).length;
      dailyPosts.push({ date: dateStr, count });
    }

    // 구독 전환율
    const premiumRate = users.length > 0 
      ? Math.round((users.filter(u => u.subscription_status === 'premium').length / users.length) * 100) 
      : 0;

    res.json({ 
      status: 'success', 
      data: { dailySignups, dailyPosts, premiumRate, totalUsers: users.length, totalPosts: posts.length }
    });
  } catch (err) {
    next(err);
  }
};

// ─── 어드민 전용 게시글 전체 조회 (숨김 포함) ───
export const getAdminPosts = async (req, res, next) => {
  try {
    const { search, filter, page = 1, limit = 20, sort = 'latest' } = req.query;
    const parsedLimit = parseInt(limit, 10);
    const parsedPage = parseInt(page, 10);
    const offset = (parsedPage - 1) * parsedLimit;

    let totalCount = 0;
    let posts = [];

    if (db.isPgActive()) {
      let queryText = 'SELECT p.*, u.nickname FROM posts p JOIN users u ON p.user_id = u.id WHERE 1=1';
      let countQueryText = 'SELECT COUNT(*) FROM posts p JOIN users u ON p.user_id = u.id WHERE 1=1';
      const queryParams = [];
      const countQueryParams = [];
      let paramIndex = 1;

      if (search) {
        const searchPattern = `%${search}%`;
        const filterStr = ` AND (LOWER(p.title) LIKE LOWER($${paramIndex}) OR LOWER(p.content) LIKE LOWER($${paramIndex}) OR LOWER(u.nickname) LIKE LOWER($${paramIndex}))`;
        queryText += filterStr;
        countQueryText += filterStr;
        queryParams.push(searchPattern);
        countQueryParams.push(searchPattern);
        paramIndex++;
      }

      if (filter === 'hidden') {
        queryText += ` AND p.is_hidden = true`;
        countQueryText += ` AND p.is_hidden = true`;
      } else if (filter === 'active') {
        queryText += ` AND p.is_hidden = false`;
        countQueryText += ` AND p.is_hidden = false`;
      }

      let orderBy = 'ORDER BY p.is_pinned DESC, p.created_at DESC';
      if (sort === 'oldest') {
        orderBy = 'ORDER BY p.is_pinned DESC, p.created_at ASC';
      } else if (sort === 'popular') {
        orderBy = 'ORDER BY p.is_pinned DESC, p.likes DESC, p.created_at DESC';
      } else if (sort === 'views') {
        orderBy = 'ORDER BY p.is_pinned DESC, p.views DESC, p.created_at DESC';
      } else if (sort === 'alphabetical') {
        orderBy = 'ORDER BY p.is_pinned DESC, p.title ASC, p.created_at DESC';
      }

      queryText += ` ${orderBy} LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
      queryParams.push(parsedLimit, offset);

      const countRes = await db.query(countQueryText, countQueryParams);
      totalCount = parseInt(countRes.rows[0].count, 10);

      const postsRes = await db.query(queryText, queryParams);
      posts = postsRes.rows || [];
    } else {
      const result = await db.query(
        'SELECT p.*, u.nickname FROM posts p JOIN users u ON p.user_id = u.id ORDER BY p.created_at DESC /* admin */'
      );
      let allPosts = result.rows || [];

      if (search) {
        const q = search.toLowerCase();
        allPosts = allPosts.filter(p => 
          (p.title && p.title.toLowerCase().includes(q)) ||
          (p.content && p.content.toLowerCase().includes(q)) ||
          (p.nickname && p.nickname.toLowerCase().includes(q))
        );
      }
      if (filter === 'hidden') allPosts = allPosts.filter(p => p.is_hidden);
      if (filter === 'active') allPosts = allPosts.filter(p => !p.is_hidden);

      if (sort === 'oldest') {
        allPosts.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
      } else if (sort === 'popular') {
        allPosts.sort((a, b) => b.likes - a.likes);
      } else if (sort === 'views') {
        allPosts.sort((a, b) => b.views - a.views);
      } else if (sort === 'alphabetical') {
        allPosts.sort((a, b) => (a.title || '').localeCompare(b.title || ''));
      } else {
        allPosts.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      }
      allPosts.sort((a, b) => (b.is_pinned ? 1 : 0) - (a.is_pinned ? 1 : 0));

      totalCount = allPosts.length;
      posts = allPosts.slice(offset, offset + parsedLimit);
    }

    res.json({ 
      status: 'success', 
      data: posts,
      pagination: {
        page: parsedPage,
        limit: parsedLimit,
        total: totalCount
      }
    });
  } catch (err) {
    next(err);
  }
};
