import { StatusCodes } from "http-status-codes";
import AppError from "../utils/AppError.js";
import SuccessResponse from "../utils/successResponse.js";
import ErrorResponse from "../utils/ErrorResponse.js";
import updateService from "../service/user.service.js";

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
        const response = await updateService(
            req.params.id,
            {
                userName : req.body.userName,
                email : req.body.email,
                password : req.body.password,
                avatar : req.body.avatar
            }
        );
        SuccessResponse.message = "Successfully updated the data";
        const {password : pass, ...rest} = response._doc;
        SuccessResponse.data = rest;
        return res.status(StatusCodes.OK).json(SuccessResponse);
    } catch (error) {
        ErrorResponse.message = "Something went wrong can't update the data";
        ErrorResponse.error = error;
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(ErrorResponse);
    }
}
export  {userController, updateController};