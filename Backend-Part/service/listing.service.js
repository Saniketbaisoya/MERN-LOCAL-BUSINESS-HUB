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
 * Then await it means execute then, it will return the array document means object....
 */
async function getAllLists({ searchTerm, sort, order, limit, startIndex, offer, furnished, parking, type }) {
    // Now yha maine order ki string value joki asc ya desc hogi usko 1 and -1 mongoDb number mai convert krdiya...
    const sortOrder = order === 'desc' ? -1 : 1;

    // Then there is a query which is built on the name and other expression...
    const query = {
        name : {$regex: searchTerm, $options: 'i'},
        offer,
        furnished,
        parking,
        type
    };
    // Now abb yha query and ek finalPrice ki filed ko add krke aggregate kr rhe hai Lists ke collections ko in mongoDb,
    // Now finalPrice is basically based on offer if the offer is true and discountedPrice is > 0 then finalPrice = discountedPrice other wise finalPrice = regularPrice,
    // Also the we will sort according to sortOrder in asc or desc
    // Then there is skip or limit for pagination...
    const response = await List.aggregate([
        {$match: query},
        {
            $addFields: {
                finalPrice: {
                    $cond: {
                        if: { $and : [{ $eq: ['$offer', true] }, { $gt: ['$discountedPrice', 0] }] },
                        then: '$discountedPrice',
                        else: '$regularPrice'
                    }
                }
            }
        },
        {
            $sort: { [sort]: sortOrder}
        },
        { $skip: parseInt(startIndex) || 0 },
        { $limit: parseInt(limit) || 9 }
    ]);
    return response;
    // this is old code... //
    // const response = await List.find({
    //     name: { $regex: searchTerm, $options: 'i' },
    //     offer,
    //     furnished,
    //     parking,
    //     type,
    // }).sort({ [sort]: order })
    // .limit(limit)
    // .skip(startIndex);
    // return response;
}
export {ListService, deleteList, updateList, getAllLists};