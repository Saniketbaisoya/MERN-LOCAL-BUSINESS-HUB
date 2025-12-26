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
    const password = LoginData.password;
    const response = await User.findOne({email});
    if(!response) throw new AppError("User not found!", StatusCodes.BAD_REQUEST);
    const hashedPasswordOnStorage = response.password;
    const isPasswordValidated =  bcryptjs.compareSync(password, hashedPasswordOnStorage); // True ya False ayegi...
    
    if(!isPasswordValidated) throw new AppError("Wrong credentials!", StatusCodes.UNAUTHORIZED);
    
    return response;
    
}

/**
 * Now first we need to check with the email that if the email of user is present or not in our database
 * So we use the findOne query of mongoose so that corressponding to the email the user is finding from the mongoDB
 * Then if the user is exist then we will create the token corressponding to the user emails to the controller 
 * But if the user with the given email is not present then we need to first create the user like creating in the above authService
 * Then we will generate the token...
 */
async function googleService(googleLoginData){
    /**
     * Now while creating the user then as we know from the google OAuth the only email displayName or avator is come
     * But for the user creatiion we need userName , password and now avatar is also created in the database
     * So if let say the user is creating normally and there is  no avatar,then we will pass the default profile image and later user can update the avatar.....
     * Now for the password we need to generate the random characters of the password and later the user can update the password
     * Same for the userName , now we generate the password + userName manually by itself because these are the required properties
     * And when the google send the data they don't have the password or userName
    */
    const generateUserName = googleLoginData.name.split(" ").join("").toLowerCase() + Math.random().toString(36).slice(-8);
    const generatePassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-4);
    const response = await User.create({userName : generateUserName, email : googleLoginData.email , password : generatePassword, avatar : googleLoginData.avatar});
    return response;
}
export  {authService, signInService, googleService};