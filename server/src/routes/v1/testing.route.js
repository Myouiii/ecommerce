import { Router } from 'express';


import insertData from '../../../tool/insert-data.js';

const router = Router();


router.get('/insert', async (req, res, next) => {
  insertData();
  res.status(200).json({ done: true });
  res.end();
});


export default router;
