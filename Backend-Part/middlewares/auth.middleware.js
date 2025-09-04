import {StatusCodes} from 'http-status-codes'
import ErrorResponse from '../utils/ErrorResponse.js';

async function authMiddleware(req,res,next) {
    if(!req.body.userName){
        ErrorResponse.message = "userName is required";
        return res.status(StatusCodes.BAD_REQUEST).json(ErrorResponse);
    }
    if(!req.body.email){
        ErrorResponse.message = "email is required"
        return res.status(StatusCodes.BAD_REQUEST).json(ErrorResponse);
    }
    if(!req.body.password){
        ErrorResponse.message = "password is required"
        return res.status(StatusCodes.BAD_REQUEST).json(ErrorResponse);
    }
    next();
}

export default authMiddleware;