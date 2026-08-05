// this is another way to handle async errors in express routes. It is a higher-order function that takes an asynchronous function as an argument and returns a new function that wraps the original function in a try-catch block. If an error occurs, it sends a JSON response with the error message and status code.
const asyncHandler = (fn) => async(req, res, next) => {
    try{
        await fn(req, res, next)
    }catch (error){
        console.log("FULL ERROR",error);
        res.status(error.code || 500).json({
            success: false,
            message:error.message
        })
    }
}

// This is a higher-order function that wraps an asynchronous request handler and catches any errors that occur during its execution. It takes a request handler function as an argument and returns a new function that handles the request and response objects, as well as the next middleware function. If an error occurs, it passes the error to the next middleware for centralized error handling.
// const asyncHandler = (requestHandler) => {
//     return (req ,res, next) => {
//     Promise.resolve(requestHandler(req, res, next))
//     .catch((error)=> next(error))
// }
// }
 
export {asyncHandler}
