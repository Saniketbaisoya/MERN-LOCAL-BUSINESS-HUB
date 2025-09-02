const AppError = (message,statusCode)=>{
    const error = new Error();
    error.message = message;
    error.statusCode = statusCode
    return error
}

export default AppError;

// class AppError1 extends Error{
//     constructor(message,statusCode){
//         super(message)
//         this.message = message,
//         this.statusCode = statusCode

//     }
// }
// module.exports = {
//     AppError1
// }