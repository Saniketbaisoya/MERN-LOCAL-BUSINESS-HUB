import express from 'express'
import isLoggedIn from '../validation/authValidation.js';
import { createListing_Controller } from '../controllers/listing.controller.js';

const router = express.Router();

/**
 * http://localhost:9000/api/create
 */
router.post('/create', isLoggedIn, createListing_Controller);
export default router;