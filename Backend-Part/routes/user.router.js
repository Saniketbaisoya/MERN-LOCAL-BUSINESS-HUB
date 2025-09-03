import express from 'express'
import userController from '../controllers/user.controller.js';

const router = express.Router();

/**
 * http://localhost:9000/api/user/test
 */
router.get('/test',userController);

export default router