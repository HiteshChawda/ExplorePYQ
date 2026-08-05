import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { User } from '../models/user.model.js';
import { uploadOnCloudinary } from '../utils/uploadOnCloudinary.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { json } from 'express';
import jwt from "jsonwebtoken";

//if you stuck on sending response in postman for a long time then in terminal -> netstat -ano | findstr :8000 then you see somthing like  TCP    0.0.0.0:8000    0.0.0.0:0    LISTENING    13916 , then run this on terminal -> Stop-Process -Id 13916 -Force and then npm run dev

const generateAccessAndRefreshTokens = async(userId) => {
    try {
        const user = await User.findById(userId)
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        user.refreshToken = refreshToken
        await user.save({validateBeforeSave: false})
        
        return{accessToken, refreshToken}

    } catch (error) {
    console.log("TOKEN ERROR:", error);

    throw new ApiError(
        500,
        "something wrong generating access and refresh tokens"
    );
}
}


const registerUser = asyncHandler(async (req, res) => {
    const { email, username, fullName, password } = req.body;
    console.log("email:", email);
    console.log("username:", username);
    


    //handeling the case when user try to register with empty fields

    if (
        [email, username, fullName, password].some((field) => field?.trim() === "")
    ) {
        throw new ApiError(400, "All fields are required");
    }

    //handeling the case when user try to register with existing email or username

    const existedUser = await User.findOne({
        $or: [{ email }, { username }]
    })
    if (existedUser) {
        throw new ApiError(409, "User already exists with this email or username");
    }
    
    const user = await User.create({
        fullName,
        email,
        password,
        username: username.toLowerCase(),
    })
    //in select function by default all fields are selected but if we want to exclude some fields then we can use - before the field name 

    const createduser = await User.findById(user._id).select("-password -refreshToken")

    if (!createduser) {
        throw new ApiError(500, "Failed to register user");
    }

    return res.status(201).json(new ApiResponse(201, createduser, "User registered successfully"));

});

const loginUser = asyncHandler(async (req, res)=>{
    const {email,password,username} = req.body

    if(!email && !username){
        throw new ApiError(400 , "username or email is required")
    }
    const user = await User.findOne({
        $or: [{username},{email}]
    })
    if(!user){
        throw new ApiError(404 , "user not exist")
    }
    const isPasswordValid = await user.isPasswordCorrect(password)

    if (!isPasswordValid){
        throw new ApiError(401, "invalid user password")
    }

    const {accessToken, refreshToken} =await generateAccessAndRefreshTokens(user._id)

    const loggedInUser = await User.findById(user.id).select("-password -refreshToken")    
    const options = {
        httpOnly: true,
        secure: true,
        sameSite: "none", //true when in production 
    }
    return res.status(200).cookie("accessToken",accessToken, options).cookie("refreshToken",refreshToken, options).json(
        new ApiResponse(200,
            {
                user: loggedInUser, accessToken,refreshToken
            },
            "user logged in successfully"
        )
    )
})

const logoutUser = asyncHandler(async(req , res)=>{
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $set:{
                refreshToken:undefined
            }
        },
        {
            new: true
        }
    )
    const options = {
        httpOnly: true,
        secure: true,
        sameSite: "none", //true when in production 
    }
    return res.status(200).clearCookie("accessToken",options).clearCookie("refreshToken",options).json(new ApiResponse(200,{},"User loged out!"))
}) 

const refreshAccessToken = asyncHandler(async(req,res)=>{
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken

    if(!incomingRefreshToken){
        throw new ApiError(401,"unauthorised request")
    }
    try {
        const decodedToken = jwt.verify(
            incomingRefreshToken,
            process.env.REFRESH_TOKEN_SECRET
        ) 
        const user = await User.findById(decodedToken?._id)
        if(!user){
            throw new ApiError(401,"invalid rfress token!")
        }    
        if (incomingRefreshToken !== user.refreshToken){
            throw new ApiError(401," refresh token expired")
        }
        const options ={
            httpOnly: true,
            secure: true,
            sameSite: "none" //true when in production
        }
        const {accessToken, newRefreshToken}= await generateAccessAndRefreshTokens(user._id)
        return res.status(200).cookie("accessToken",accessToken,options).cookie("newRefreshToken",newRefreshToken,options).json(
            new ApiResponse(
                200,
                {accessToken, refreshToken: newRefreshToken},
                "Access token Refreshed"
            )
        )
    } catch (error) {
        throw new ApiError(400, error?.message || "invalid refresh Token" )
        
    }
})

const getCurrentUser = asyncHandler(async (req, res) => {
    return res.status(200).json(
        new ApiResponse(
            200,
            req.user,
            "Current user fetched successfully"
        )
    );
});



export { registerUser ,loginUser ,logoutUser ,refreshAccessToken ,getCurrentUser};