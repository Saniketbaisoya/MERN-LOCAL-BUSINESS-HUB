import { StatusCodes } from "http-status-codes";
import User from "../schema/user.model.js";
import AppError from "../utils/AppError.js";
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { SECRET_KEY } from "../configuration/serverConfig.js";

async function authService(UserData) {
    const response = await User.create(UserData);
    // await response.save();
    return response;
}

/**
 * Now the LoginData coming from the controller
 * First we need to check if the email they send if it is present or not
 * Second if the email is present then we will compare the password with their has password
 * Third if the password is compared successFully then we will generate the token corressponding to the id+email of the user and we will save it in the cookies for some time so that they cannot login again for some time duration 
 * 
 */
async function signInService(LoginData) {

    const email  = LoginData.email;
    const password = LoginData.password
    const response = await User.findOne({email});
    if(!response) throw new AppError("User not found!", StatusCodes.BAD_REQUEST);
    const hashedPasswordOnStorage = response.password;
    const isPasswordValidated =  bcryptjs.compareSync(password, hashedPasswordOnStorage); // True ya False ayegi...
    
    if(!isPasswordValidated) throw new AppError("Wrong credentials!", StatusCodes.UNAUTHORIZED);
    
    const token = await jwt.sign({id : response._id, email : response.email},SECRET_KEY);

    return token;
    
}
export  {authService, signInService};