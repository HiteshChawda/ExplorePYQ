import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { User } from '../models/user.model.js';
import { uploadOnCloudinary } from '../utils/uploadOnCloudinary.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { json } from 'express';
import jwt from "jsonwebtoken";
import { generateOtp, getOtpExpiry } from '../utils/generateOtp.js';
import { sendOtpEmail } from '../utils/sendEmail.js';

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

const cookieOptions = () => ({
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
});


//register user

const registerUser = asyncHandler(async (req, res) => {
    const { email, username, fullName, password, role } = req.body;

    if (
        [email, username, fullName, password].some((field) => field?.trim() === "")
    ) {
        throw new ApiError(400, "All fields are required");
    }

    const existedUser = await User.findOne({
        $or: [{ email }, { username }]
    })
    if (existedUser) {
        throw new ApiError(409, "User already exists with this email or username");
    }

    // Only allow "creator" or default to "viewer" — never trust arbitrary input blindly
    const finalRole = role === "creator" ? "creator" : "viewer";
    const isCreator = finalRole === "creator";

    const userPayload = {
        fullName,
        email,
        password,
        username: username.toLowerCase(),
        role: finalRole,
        isVerified: !isCreator, // viewers: true, creators: false
    };

    if (isCreator) {
        const otp = generateOtp();
        userPayload.otp = otp;
        userPayload.otpExpiry = getOtpExpiry();
    }

    const user = await User.create(userPayload);

    const createduser = await User.findById(user._id).select("-password -refreshToken -otp -otpExpiry")

    if (!createduser) {
        throw new ApiError(500, "Failed to register user");
    }

    if (isCreator) {
        try {
            await sendOtpEmail(email, user.otp);
        } catch (error) {
            console.log("OTP EMAIL ERROR:", error);
            // Don't fail registration if email fails — user can use "resend OTP"
        }

        return res.status(201).json(
            new ApiResponse(
                201,
                { user: createduser, requiresOtp: true },
                "Registered successfully. Please verify the OTP sent to your email."
            )
        );
    }

    return res.status(201).json(
        new ApiResponse(201, { user: createduser, requiresOtp: false }, "User registered successfully")
    );
});

// verify otp

const verifyOtp = asyncHandler(async (req, res) => {
    const { email, otp } = req.body;

    if (!email || !otp) {
        throw new ApiError(400, "Email and OTP are required");
    }

    const user = await User.findOne({ email });

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    if (user.isVerified) {
        throw new ApiError(400, "Account is already verified");
    }

    if (!user.otp || !user.otpExpiry) {
        throw new ApiError(400, "No OTP found. Please request a new one");
    }

    if (user.otpExpiry < new Date()) {
        throw new ApiError(400, "OTP has expired. Please request a new one");
    }

    if (user.otp !== otp) {
        throw new ApiError(400, "Invalid OTP");
    }

    user.isVerified = true;
    user.otp = undefined;
    user.otpExpiry = undefined;
    await user.save({ validateBeforeSave: false });

    return res.status(200).json(
        new ApiResponse(200, {}, "Email verified successfully. You can now log in.")
    );
});

// resend otp

const resendOtp = asyncHandler(async (req, res) => {
    const { email } = req.body;

    if (!email) {
        throw new ApiError(400, "Email is required");
    }

    const user = await User.findOne({ email });

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    if (user.isVerified) {
        throw new ApiError(400, "Account is already verified");
    }

    const otp = generateOtp();
    user.otp = otp;
    user.otpExpiry = getOtpExpiry();
    await user.save({ validateBeforeSave: false });

    await sendOtpEmail(email, otp);

    return res.status(200).json(
        new ApiResponse(200, {}, "A new OTP has been sent to your email")
    );
});


//login user

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

    if (!user.isVerified) {
        throw new ApiError(403, "Please verify your email before logging in. Check your inbox for the OTP.")
    }

    const {accessToken, refreshToken} =await generateAccessAndRefreshTokens(user._id)

    const loggedInUser = await User.findById(user.id).select("-password -refreshToken -otp -otpExpiry")
    const options = cookieOptions();

    return res.status(200).cookie("accessToken",accessToken, options).cookie("refreshToken",refreshToken, options).json(
        new ApiResponse(200,
            {
                user: loggedInUser, accessToken,refreshToken
            },
            "user logged in successfully"
        )
    )
})


// logout user

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
    const options = cookieOptions();

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
        const options = cookieOptions();
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

export { registerUser ,loginUser ,logoutUser ,refreshAccessToken ,getCurrentUser, verifyOtp, resendOtp };