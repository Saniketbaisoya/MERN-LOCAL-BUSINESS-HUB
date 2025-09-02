import authService from "../service/auth.service.js";
import ErrorResponse from "../utils/ErrorResponse.js";
import SuccessResponse from "../utils/successResponse.js";
import {StatusCodes} from 'http-status-codes'
async function authController(req,res) {
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
        ErrorResponse.error = error;
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(ErrorResponse);
    }
   
}
export default authController;