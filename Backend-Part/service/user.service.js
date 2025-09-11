import User from "../schema/user.model.js";

async function updateService(id,data) {
    console.log(" enter in service ");
    const response = await User.findByIdAndUpdate(id,data,{new : true});
    console.log(response);
    return response;
}
export default updateService;