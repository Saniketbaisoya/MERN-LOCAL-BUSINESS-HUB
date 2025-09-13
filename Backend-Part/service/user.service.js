import User from "../schema/user.model.js";

async function updateService(id,data) {
    const response = await User.findByIdAndUpdate(id,data,{new : true});
    return response;
}

async function deleteService(id) {
    const response = await User.findByIdAndDelete(id);
    return response;
}

export  {updateService, deleteService};