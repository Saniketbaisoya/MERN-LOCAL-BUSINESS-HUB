import express from 'express'
import  { userController, updateController, deleteController } from '../controllers/user.controller.js';
import isLoggedIn from '../validation/authValidation.js';

const router = express.Router();

/**
 * http://localhost:9000/api/user/test
 */
router.get('/test', userController);

/**
 * http://localhost:9000/api/user/update/:id
 */
router.patch('/update/:id', isLoggedIn, updateController);

/**
 * http://localhost:9000/api/user/delete/:id
 */
router.delete('/delete/:id', isLoggedIn, deleteController);
export default router;