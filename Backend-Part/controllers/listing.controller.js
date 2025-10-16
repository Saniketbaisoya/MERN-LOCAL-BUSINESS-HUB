import { StatusCodes } from "http-status-codes";
import SuccessResponse from "../utils/successResponse.js";
import ErrorResponse from "../utils/ErrorResponse.js";
import { deleteList, getAllLists, ListService, updateList } from "../service/listing.service.js";
import List from "../schema/listing.model.js";

/**
 * 
 */
async function createListing_Controller(req,res) {
    try {
        const response = await ListService(req.body);
        SuccessResponse.message = "List created successfully !!";
        SuccessResponse.data = response;
        return res.status(StatusCodes.CREATED).json(SuccessResponse);
    } catch (error) {
        ErrorResponse.message = "Something went wrong can't created successfully";
        ErrorResponse.error = error;
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(ErrorResponse);
    }
}

async function deleteList_Controller(req,res) {
    const listings = await List.findById( req.params.id);
    if(!listings){
        ErrorResponse.data = listings
        ErrorResponse.message = "List not Found";
        return res.status(StatusCodes.BAD_REQUEST).json(ErrorResponse);
    }
    if(req.user.id !== listings.useRef){
        return res.status(StatusCodes.BAD_REQUEST).json("You can only delete your own lists");
    }
    try {
        const response = await deleteList(req.params.id);
        return res.status(StatusCodes.OK).json("List has been deleted SuccessFully");
    } catch (error) {
        ErrorResponse.data = error;
        ErrorResponse.message = error.message;
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(ErrorResponse);
    }
};

async function updateList_Controller(req,res) {
    const listings = await List.findById( req.params.id);
    if(!listings){
        ErrorResponse.data = listings
        ErrorResponse.message = "List not Found";
        return res.status(StatusCodes.BAD_REQUEST).json(ErrorResponse);
    }
    if(req.user.id !== listings.useRef){
        return res.status(StatusCodes.BAD_REQUEST).json("You can only update your own lists");
    }
    try {
        const response = await updateList(req.params.id, req.body);
        SuccessResponse.data = response;
        SuccessResponse.message = "List has been updated SuccessFully";
        return res.status(StatusCodes.OK).json(SuccessResponse);
    } catch (error) {
        ErrorResponse.data = error;
        ErrorResponse.message = error.message;
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(ErrorResponse);
    }
};

async function getListing_controller(req,res) {
    try {
        const response = await List.findById(req.params.id);
        if(!response){
            return res.status(StatusCodes.BAD_REQUEST).json("List not Found");
        }
        SuccessResponse.data = response;
        SuccessResponse.message = "List has been fetch SuccessFully";
        return res.status(StatusCodes.OK).json(SuccessResponse);
    } catch (error) {
        ErrorResponse.data = error;
        ErrorResponse.message = error.message;
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(ErrorResponse);
    }
};

async function getAllListing_controller(req,res) {
    try {
        /**
         * Now limit varibale yeah define krta hai ki kitne query params aa skte hai ek bari mai listings ko search krne ke liye
         * Also the searching would be start from the specific index of the query params , because it needs some time to search from a specific query
         * But if there is no start index then start by default from the 0th index of query params....
        */
        const limit = parseInt(req.query.limit) || 9;
        const startIndex = parseInt(req.query.startIndex) || 0;
        /**
         * Now offer which is query params uski byDefault value ya toh undefined hogi ya phr false hogi,
         * Now undefined ke case mai dono value ho skti hai ya toh true ya false , but if the value of offer is false then it is false or if true then true
         * That means offer value true ya false mai se hi koi hogi and if you see here in case of undefined the offer value would be dynamically randomly alloted that means the offer as a variable should be the let not const
         * Isliye yha offer =  {$in : [true,false]} $in ko use kiya hai, because $in yani mongoDB ki query and voh allot krega ya toh true ya false....
        */
        let offer = req.query.offer;
         if(offer === undefined || offer === 'false'){
           offer =  {$in : [true,false]}
        }

        let furnished = req.query.furnished;
        if(furnished === undefined || furnished ==='false'){
            furnished = {$in : [true,false]}
        }

        let parking = req.query.parking;
        if(parking === undefined || parking === 'false'){
            parking = {$in : [true, false]}
        }

        let type = req.query.type;
        if(type === undefined || type === 'all'){
            type = {$in : ['sale', 'rent']};
        }

        const searchTerm = req.query.searchTerm || '';
        const sort = req.query.sort || 'createdAt';

        const order = req.query.order || 'desc';

        const response = await getAllLists({
            searchTerm,
            sort,
            order,
            limit,
            startIndex,
            offer,
            furnished,
            parking,
            type,
        });
        SuccessResponse.data = response;
        return res.status(StatusCodes.OK).json(SuccessResponse);
    }catch(error) {
        ErrorResponse.data = error;
        ErrorResponse.message = error.message;
        return res.status(StatusCodes.BAD_REQUEST).json(ErrorResponse);
    }
}
export {createListing_Controller, deleteList_Controller, updateList_Controller, getListing_controller, getAllListing_controller};