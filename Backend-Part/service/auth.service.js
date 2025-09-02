import User from "../schema/user.model.js";

async function authService(UserData) {
    const response = await User.create(UserData);
    await response.save()
    return response;
}
export default authService;