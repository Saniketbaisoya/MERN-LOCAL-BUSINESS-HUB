import express from 'express'
import isLoggedIn from '../validation/authValidation.js';
import { createListing_Controller, deleteList_Controller, updateList_Controller, getListing_controller, getAllListing_controller } from '../controllers/listing.controller.js';

const router = express.Router();

/**
 * http://localhost:9000/api/create
 */
router.post('/create', isLoggedIn, createListing_Controller);


/**
 * http://localhost:9000/api/listing/delete/:id
 */
router.delete('/delete/:id', isLoggedIn, deleteList_Controller);

/**
 * http://localhost:9000/api/listing/updateList/:id
 */
router.patch('/updateList/:id', isLoggedIn, updateList_Controller);

/**
 * http://localhost:9000/api/listing/get/:id
 */
router.get('/get/:id',getListing_controller);

/**
 * http://localhost:9000/api/listing/get
 */
router.get('/get',getAllListing_controller);
export default router;