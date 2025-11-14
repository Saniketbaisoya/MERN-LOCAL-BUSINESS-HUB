import jwt from 'jsonwebtoken';
import { StatusCodes } from 'http-status-codes';
import ErrorResponse from '../utils/ErrorResponse.js';
import AppError from '../utils/AppError.js';
import { SECRET_KEY } from '../configuration/serverConfig.js';

async function authenticate(req,res) {
    const token = req.cookies['access-token'];
    if(!token){
        // throw new AppError("Unauthorized",StatusCodes.UNAUTHORIZED);
        ErrorResponse.message = "Unauthorized";
        return res.json({authenticated : false});
    }
    try {
        const decode = jwt.verify( token, SECRET_KEY );
        if(!decode){
            // throw new AppError("Forbidden",StatusCodes.FORBIDDEN);
            ErrorResponse.message = "Forbidden";
            return res.status(StatusCodes.FORBIDDEN).json({authenticated : false});
        }
       return res.status(StatusCodes.OK).json({authenticated : true, user : {id : decode.id} });
    } catch (error) {
        // throw new AppError("Invalid Token",StatusCodes.UNAUTHORIZED);
        ErrorResponse.message = "Invalid Token";
        ErrorResponse.error = error
        return res.status(StatusCodes.UNAUTHORIZED).json({authenticated : false});
    }

}
export default authenticate;