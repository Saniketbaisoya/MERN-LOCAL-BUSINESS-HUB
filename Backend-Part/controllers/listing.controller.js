import { StatusCodes } from "http-status-codes";
import SuccessResponse from "../utils/successResponse.js";
import ErrorResponse from "../utils/ErrorResponse.js";
import { deleteList, ListService, updateList } from "../service/listing.service.js";
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

export {createListing_Controller, deleteList_Controller, updateList_Controller};