import List from "../schema/listing.model.js";
import User from "../schema/user.model.js";

async function updateService(id,data) {
    // so here the {new : true} is important because if don't then we don't get the updated data in return we get the previous data....
    const response = await User.findByIdAndUpdate(id,data,{new : true});
    return response;
}

async function deleteService(id) {
    const response = await User.findByIdAndDelete(id);
    return response;
}

async function getAllListings(id) {
    const response = await List.find({useRef : id});
    return response;
}
export  {updateService, deleteService, getAllListings};