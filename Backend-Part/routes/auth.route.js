import express from 'express'
import authMiddleware from '../middlewares/auth.middleware.js';
import authController from '../controllers/auth.controller.js';

const router = express.Router();

/**
 * http://localhost:9000/api/
 */
router.post('/',authMiddleware,authController);

export default router;

