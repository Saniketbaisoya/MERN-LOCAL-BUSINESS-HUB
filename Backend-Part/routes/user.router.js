import express from 'express'
import  { userController, updateController } from '../controllers/user.controller.js';
import isLoggedIn from '../validation/authValidation.js';

const router = express.Router();

/**
 * http://localhost:9000/api/user/test
 */
router.get('/test',userController);

/**
 * http://localhost:9000/api/user/update/:id
 */
router.patch('/update/:id' ,isLoggedIn ,updateController);
export default router;