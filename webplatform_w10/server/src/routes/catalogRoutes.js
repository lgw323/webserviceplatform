import express from 'express';
import { CPU_CATALOG, GPU_CATALOG } from '../config/hardwareCatalog.js';

const router = express.Router();

router.get('/search', (req, res) => {
  const { type, q } = req.query;
  if (!type || !q) {
    return res.json({ success: true, data: [] });
  }

  const catalog = type.toLowerCase() === 'cpu' ? CPU_CATALOG : GPU_CATALOG;
  const searchStr = q.toLowerCase().trim();

  const results = catalog.filter(model => model.toLowerCase().includes(searchStr));

  res.json({
    success: true,
    data: results
  });
});

export default router;
