import { StatusCodes } from "http-status-codes";
import SuccessResponse from "../utils/successResponse.js";
import ErrorResponse from "../utils/ErrorResponse.js";
import { ListService } from "../service/listing.service.js";

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

export {createListing_Controller};