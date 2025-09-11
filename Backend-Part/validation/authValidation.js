import jwt from 'jsonwebtoken';
import { StatusCodes } from 'http-status-codes';
import ErrorResponse from '../utils/ErrorResponse.js';
import AppError from '../utils/AppError.js';
import { SECRET_KEY } from '../configuration/serverConfig.js';

async function isLoggedIn(req,res,next) {
    const token = req.cookies['access-token'];
    if(!token){
        // throw new AppError("Unauthorized",StatusCodes.UNAUTHORIZED);
        ErrorResponse.message = "Unauthorized";
        return res.status(StatusCodes.UNAUTHORIZED).json(ErrorResponse);
    }
    try {
        const decode = jwt.verify( token, SECRET_KEY );
        if(!decode){
            // throw new AppError("Forbidden",StatusCodes.FORBIDDEN);
            ErrorResponse.message = "Forbidden";
            return res.status(StatusCodes.FORBIDDEN).json(ErrorResponse);
        }
        req.user = {
            id : decode.id
        }
        next();
    } catch (error) {
        // throw new AppError("Invalid Token",StatusCodes.UNAUTHORIZED);
        ErrorResponse.message = "Invalid Token";
        ErrorResponse.error = error
        return res.status(StatusCodes.UNAUTHORIZED).json(ErrorResponse);
    }

}
export default isLoggedIn;