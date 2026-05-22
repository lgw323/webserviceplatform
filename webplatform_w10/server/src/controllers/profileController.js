import { db } from '../config/db.js';

export const getHardwareProfiles = async (req, res, next) => {
  try {
    const result = await db.query(
      'SELECT * FROM hardware_profiles WHERE user_id = $1 ORDER BY created_at DESC',
      [req.user.id]
    );
    res.json({ status: 'success', data: result.rows });
  } catch (err) {
    next(err);
  }
};

export const createHardwareProfile = async (req, res, next) => {
  try {
    const { cpu_model, gpu_model, ram_gb, resolution, refresh_rate, is_default } = req.body;

    if (!cpu_model || !gpu_model || !ram_gb || !resolution || !refresh_rate) {
      return res.status(400).json({
        status: 'error',
        message: '하드웨어 정보(CPU, GPU, RAM, 해상도, 주사율)는 모두 필수입니다.'
      });
    }

    let result;
    if (db.isPgActive()) {
      const client = await db.getClient();
      try {
        await client.query('BEGIN');
        if (is_default) {
          await client.query(
            'UPDATE hardware_profiles SET is_default = false WHERE user_id = $1',
            [req.user.id]
          );
        }
        result = await client.query(
          `INSERT INTO hardware_profiles 
           (user_id, is_default, cpu_model, gpu_model, ram_gb, resolution, refresh_rate) 
           VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
          [
            req.user.id,
            is_default || false,
            cpu_model,
            gpu_model,
            parseInt(ram_gb),
            resolution,
            parseInt(refresh_rate)
          ]
        );
        await client.query('COMMIT');
      } catch (err) {
        await client.query('ROLLBACK');
        throw err;
      } finally {
        client.release();
      }
    } else {
      // Mock db behavior
      if (is_default) {
        await db.query(
          'UPDATE hardware_profiles SET is_default = false WHERE user_id = $1',
          [req.user.id]
        );
      }
      result = await db.query(
        `INSERT INTO hardware_profiles 
         (user_id, is_default, cpu_model, gpu_model, ram_gb, resolution, refresh_rate) 
         VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
        [req.user.id, is_default || false, cpu_model, gpu_model, parseInt(ram_gb), resolution, parseInt(refresh_rate)]
      );
    }

    res.status(201).json({
      status: 'success',
      message: 'Hardware profile created successfully.',
      data: result.rows[0]
    });
  } catch (err) {
    next(err);
  }
};

export const setDefaultProfile = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    if (db.isPgActive()) {
      const client = await db.getClient();
      try {
        await client.query('BEGIN');
        await client.query(
          'UPDATE hardware_profiles SET is_default = false WHERE user_id = $1',
          [req.user.id]
        );
        await client.query(
          'UPDATE hardware_profiles SET is_default = true WHERE id = $1 AND user_id = $2',
          [id, req.user.id]
        );
        await client.query('COMMIT');
      } catch (err) {
        await client.query('ROLLBACK');
        throw err;
      } finally {
        client.release();
      }
    } else {
      await db.query('UPDATE hardware_profiles SET is_default = true WHERE id = $1', [id]);
    }

    res.json({ status: 'success', message: '기본 프로필이 변경되었습니다.' });
  } catch (err) {
    next(err);
  }
};

export const deleteProfile = async (req, res, next) => {
  try {
    const { id } = req.params;
    await db.query('DELETE FROM hardware_profiles WHERE id = $1', [id]);
    res.json({ status: 'success', message: '하드웨어 프로필이 삭제되었습니다.' });
  } catch (err) {
    next(err);
  }
};
