import express from 'express'
import authMiddleware from '../middlewares/auth.middleware.js';
import {signIn, signUp} from '../controllers/auth.controller.js';

const router = express.Router();

/**
 * http://localhost:9000/api/
 */
router.post('/',authMiddleware,signUp);

/**
 * http://localhost:9000/api/signin
 */
router.post('/signin',signIn);

export default router;

