import mongoose from "mongoose";

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
        typr : String,
        required : true
    }
},
    {timestamps : true}
)

const User = mongoose.model('User',UserSchema);

export default User;
