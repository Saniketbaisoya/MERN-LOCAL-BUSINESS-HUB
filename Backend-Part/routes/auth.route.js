import express from 'express'
import authMiddleware from '../middlewares/auth.middleware.js';
import {google, signIn, signOut, signUp} from '../controllers/auth.controller.js';

const router = express.Router();

/**
 * http://localhost:9000/api/
 */
router.post('/', authMiddleware,signUp);

/**
 * http://localhost:9000/api/signin
 */
router.post('/signin', signIn);

/**
 * http://localhost:9000/api/googleAuth
 */
router.post('/googleAuth', google);

/**
 * http://localhost:9000/api/signout
 */
router.get('/signout', signOut);

export default router;

