import List from "../schema/listing.model.js";

async function ListService(data) {
    const list = await List.create(data);
    return list;
}

export {ListService};