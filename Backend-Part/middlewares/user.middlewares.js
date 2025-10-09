import {StatusCodes} from 'http-status-codes'
import ErrorResponse from '../utils/ErrorResponse.js';

async function userMiddleware(req,res,next) {
    if(!req.params.id){
        ErrorResponse.message = "Id is required";
        return res.status(StatusCodes.BAD_REQUEST).json(ErrorResponse);
    }
    next();
}

export default userMiddleware;