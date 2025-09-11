import User from "../schema/user.model.js";

async function updateService(id,data) {
    const response = await User.findByIdAndUpdate(id,data);
    return response;
}
export default updateService;