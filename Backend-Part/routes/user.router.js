import express from 'express'
import  { userController, updateController, deleteController, getAllListings_Controller } from '../controllers/user.controller.js';
import isLoggedIn from '../validation/authValidation.js';
import userMiddleware from '../middlewares/user.middlewares.js';

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

/**
 * http://localhost:9000/api/user/listings/:id 
 */
router.get('/listings/:id', isLoggedIn, getAllListings_Controller);

export default router;