import List from "../schema/listing.model.js";

async function ListService(data) {
    const list = await List.create(data);
    return list;
}

async function deleteList(id) {
    const response = await List.findByIdAndDelete(id);
    return response;
}

async function updateList(id,data) {
    const response = await List.findByIdAndUpdate(id,data,{new : true});
    return response;
}

/**
 * Now in this case the database send sort is not an function , mtlb hmm plain javascript array object ke upr sort mongoose query ka sort function use krre the
 * JavaScript ka sort function nhi , also when we using the mongoose query like find etc... in that case the mongoDB return mongoose query object 
 * And when you await it, it will execute the query then make an array object and then controller have array object and uske upr yeah mongoose ke functions like sort, skip, limit lgayege toh mongoDb error toh bejega hi....
*/
// async function getAllLists(data) {
//     const response = await List.find(data);
//     return response;
// }

/**
 * Toh abb hmne yha sari values ko parameters ki form mai le aye then after using the find query we get mongoose query object and then on that object we will implemnt the sort, skip or limit functions 
 * Then await it means execute then it will return the array document means object....
 */
async function getAllLists({ searchTerm, sort, order, limit, startIndex, offer, furnished, parking, type }) {
    const response = await List.find({
        name: { $regex: searchTerm, $options: 'i' },
        offer,
        furnished,
        parking,
        type,
    }).sort({ [sort]: order })
    .limit(limit)
    .skip(startIndex);
    return response;
}
export {ListService, deleteList, updateList, getAllLists};