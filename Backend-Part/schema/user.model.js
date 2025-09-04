import mongoose from "mongoose";
import bcryptjs from "bcryptjs";
const UserSchema = new mongoose.Schema({
    userName : {
        type : String,
        required : true,
        unique : true,
    },
    email : {
        type : String,
        required : true,
        unique : true,
    },
    password : {
        type : String,
        required : true,
    }
},{
    timestamps : true,
});

UserSchema.pre('save',async function (next){
    try {
        // Now abhi userSchema ka use krke maine pre hook function create kiya 
        // toh this ke liye call site hogya userSchema toh uska pura access this ke andr hoga....
        const saltOrRounds = await bcryptjs.genSalt(10);
        const hashPassword = await bcryptjs.hash(this.password,saltOrRounds);
        this.password = hashPassword;
        next(); // Proceed to save 
    }catch (error) {
        next(error);
    }
})


const User = mongoose.model("User",UserSchema);

export default User;
