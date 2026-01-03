import { GEMINI_API_KEY } from '../configuration/serverConfig.js'
import { StatusCodes } from 'http-status-codes';
import { chatService } from '../service/chat.service.js';

/**
 * Key problems arise while segregating the code of chat bot is :   

    Logic Split incorrectly:  In your chatService.js (right side of screenshot), 
                              you are attempting to handle both chatHistory and a single message. 
                              However, the chat_controller (left side) is trying to call the service 
                              but isn't passing the parameters in a way that the service can consistently handle.

    Variable Scope: The model initialization is inside the chatService function. 
                    This is fine, but the logic inside the if(Array.isArray(chatHistory)) 
                    block in your service is returning botResponse early, while the fallback code 
                    (lines 60-63) is also trying to execute.

    Data Formatting: The formattedHistory logic in the service needs to ensure 
                     it doesn't mutate or fail if the data isn't perfectly structured 
                     when it comes from the controller.

    Structure of successResponse and ErrorResponse: See when i try to use my SuccessResponse and ErrorResponse structure to
                                                    send to the gemini then it will not consider it to parse and send the response,
                                                    so it is neccassary to use their define structure which is already given in their peace of code
                                                    which is { success: parameter(true/false), response: botResponse }
*/

/**
 * @param {*} req => { chatHistroy, message };
 * @returns => statusCode and {
 *      success parameter(true/false),
 *      response: botResponse
 * };
 */

async function chat_controller(req, res) {
    try {
       

        // here add the .env's GEMINI_API_KEY by first seggregating into the configuration.js folder... //
        if (!GEMINI_API_KEY) {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                success: false,
                response: 'Gemini API key is not configured. Please add GEMINI_API_KEY to your .env file.'
            });
        };

        const botResponse = await chatService(req.body);

        return res.status(StatusCodes.OK).json({
            success: true,
            response: botResponse // This 'response' key matches what your UI is looking for
        });
    }catch (error) {
        console.error('Error in /api/chat:', error)

        if (error?.message?.includes('429') || error?.message?.includes('quota')) {
            return res.status(StatusCodes.OK).json({
                success: false,
                response: 'API quota exceeded. Please wait a moment and try again.'
            });
        }

        return res.status(StatusCodes.BAD_REQUEST).json({
            success: false,
            response: error?.message || 'Sorry, something went wrong while talking to the AI service. Please try again.' 
        });
    }
}
export{
    chat_controller
};