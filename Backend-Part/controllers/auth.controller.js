import { authService, googleService, signInService } from "../service/auth.service.js";
import ErrorResponse from "../utils/ErrorResponse.js";
import SuccessResponse from "../utils/successResponse.js";
import {StatusCodes} from 'http-status-codes'
import jwt from 'jsonwebtoken';
import { SECRET_KEY } from "../configuration/serverConfig.js";
import User from "../schema/user.model.js";
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
        
        const token = await jwt.sign({id : response._id, email : response.email},SECRET_KEY);
        res.cookie("access-token",token,{
            httpOnly : true,
            secure : false
        })

        const {password : pass, ...rest} = response._doc;
        SuccessResponse.data = rest;
        SuccessResponse.message = "Successfully login !!";
        return res.status(StatusCodes.OK).json(SuccessResponse);
    } catch (error) {
        ErrorResponse.message = error.message;
        ErrorResponse.error = error;
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(ErrorResponse);
    }

}

async function google(req,res) {
    /**
     * Now first we send the only email to the service layer 
     * But from the frontend of the OAuth the avatar is also come so that case we need to handle it
     */
    try {
        const user = await User.findOne({email : req.body.email});
        if(user){
            const token = await jwt.sign({id: user._id, email: user.email},SECRET_KEY);
            res.cookie("access-token",token,{
                httpOnly : true,
                secure : false
            })
            SuccessResponse.message = "SuccessFully login with Google !!";
            const {password : pass, ...rest} = user._doc;
            SuccessResponse.data = rest;
            return res.status(StatusCodes.OK).json(SuccessResponse);
        }else{
            const response = await googleService({
                name : req.body.name,
                email : req.body.email,
                avatar : req.body.avatar
            })
        
            const token = jwt.sign({id : response._id, email : response.email},SECRET_KEY);
            res.cookie("access-token",token,{
                httpOnly : true,
                secure : false
            })
            SuccessResponse.message = "SuccessFully login with Google !!";
            const {password : pass, ...rest} = response._doc;
            SuccessResponse.data = rest;
            return res.status(StatusCodes.OK).json(SuccessResponse);
        }
    } catch (error) {
        ErrorResponse.message = error.message,
        ErrorResponse.error = error;
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(ErrorResponse);
    }
}

/**
 * Now signOut ka actual meaning hai ki jo cookie stored hai with token
 * Agr usko clear krde toh uss case mai jo login session hai voh rhega hi ni
 * And then hmm login ni rhege toh signOut hi ho jayege toh sirf token ko clear krdena hi signOut hain
 * Also yeah signOut tbhi hoga jb user ne login kiya hua hoga phele se hi means agr token store hoga tbhi signOut hoga
 * 
 */
async function signOut(req,res) {
    
    try {
        res.clearCookie('access-token');
        SuccessResponse.message = "User logout sucessfully !!"
        return res.status(StatusCodes.OK).json(SuccessResponse);
    } catch (error) {
        ErrorResponse.error = error
        ErrorResponse.message = error.message
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json("Internal");
    }
}
export  {signUp, signIn, google, signOut};