import { authService, signInService } from "../service/auth.service.js";
import ErrorResponse from "../utils/ErrorResponse.js";
import SuccessResponse from "../utils/successResponse.js";
import {StatusCodes} from 'http-status-codes'
async function signUp(req,res) {
    try {
        const response = await authService({
            userName : req.body.userName,
            email : req.body.email,
            password : req.body.password
        });
        SuccessResponse.message = "SuccessFully created the User";
        SuccessResponse.data = response;
        return res.status(StatusCodes.CREATED).json(SuccessResponse);
    } catch (error) {
        ErrorResponse.message = error.message;
        ErrorResponse.error = error;
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(ErrorResponse);
    }
   
}

async function signIn(req,res) {

    try {
        const response = await signInService({
            email : req.body.email,
            password : req.body.password
        })
        delete response.password;
        SuccessResponse.message = "Successfully login !!";
        res.cookie("access-token",response,{
            httpOnly : true,
            secure : false
        })
        return res.status(StatusCodes.OK).json(SuccessResponse);
    } catch (error) {
        ErrorResponse.message = error.message;
        ErrorResponse.error = error;
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(ErrorResponse);
    }

}

export  {signUp,signIn};