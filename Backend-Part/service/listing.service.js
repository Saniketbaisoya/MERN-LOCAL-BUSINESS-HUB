import List from "../schema/listing.model.js";

async function ListService(data) {
    const list = await List.create(data);
    return list;
}

async function deleteList(id) {
    const response = await List.findByIdAndDelete(id);
    return response;
}
export {ListService, deleteList};