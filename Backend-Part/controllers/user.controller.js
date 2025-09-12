import { StatusCodes } from "http-status-codes";
import bcryptjs from 'bcryptjs'
import AppError from "../utils/AppError.js";
import SuccessResponse from "../utils/successResponse.js";
import ErrorResponse from "../utils/ErrorResponse.js";
import  { deleteService, updateService } from "../service/user.service.js";
import User from "../schema/user.model.js";

async function userController(req,res,next) {
    return res.json({
        message : "Api is Working"
    })
}

async function updateController(req,res) {
    if(req.user.id != req.params.id){
        // throw new AppError("You can only update your own account!",StatusCodes.UNAUTHORIZED);
        ErrorResponse.message = "You can only update your own account!"
        return res.status(StatusCodes.UNAUTHORIZED).json(ErrorResponse);
    }
    try {
        const email = await User.findOne({email : req.body.email});
        if(email){
            ErrorResponse.message = "This email is already exists !!";
            return res.status(StatusCodes.BAD_REQUEST).json(ErrorResponse);
        }
        if(req.body.password){
            bcryptjs.hashSync(req.body.password,10);
        }
        const response = await updateService(
            req.params.id,
            {
                userName : req.body.userName,
                email : req.body.email,
                password : req.body.password,
                avatar : req.body.avatar
            },
        );
        SuccessResponse.message = "Successfully updated the data";
        const {password : pass, ...rest} = response._doc;
        SuccessResponse.data = rest;
        return res.status(StatusCodes.OK).json(SuccessResponse);
    } catch (error) {
        ErrorResponse.message = error.message;
        ErrorResponse.error = error;
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(ErrorResponse);
    }
}

async function deleteController(req,res) {
    if(req.user.id != req.params.id){
        ErrorResponse.message = "You can only delete your own account!"
        return res.status(StatusCodes.UNAUTHORIZED).json(ErrorResponse); 
    }
    try {
        await deleteService(req.params.id);
        SuccessResponse.message = "Successfully deleted the account !!";

        res.clearCookie('access-token');
        res.status(StatusCodes.OK).json(SuccessResponse.message);
    } catch (error) {
        ErrorResponse.message = error.message;
        ErrorResponse.error = error;
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(ErrorResponse);
    }
}
export  {userController, updateController, deleteController};