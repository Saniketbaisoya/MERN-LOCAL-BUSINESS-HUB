import jwt from 'jsonwebtoken';
import { StatusCodes } from 'http-status-codes';
import ErrorResponse from '../utils/ErrorResponse.js';
import AppError from '../utils/AppError.js';
import { SECRET_KEY } from '../configuration/serverConfig.js';

async function isLoggedIn(req,res,next) {
    
    const token = req.cookies['access-token'];
    if(!token){
        throw new AppError("Unauthorized",StatusCodes.UNAUTHORIZED);
    }
    try {
        const decode = jwt.verify( token, SECRET_KEY );
        if(!decode){
            throw new AppError("Forbidden",StatusCodes.FORBIDDEN);
        }
        req.user = {
            id : decode.id,
            email : decode.email
        }
        next();
    } catch (error) {
        throw new AppError("Invalid Token",StatusCodes.UNAUTHORIZED);
    }

}
export default isLoggedIn;