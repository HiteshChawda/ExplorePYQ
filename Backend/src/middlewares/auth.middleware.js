import jwt from "jsonwebtoken";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";

export const verifyJWT = asyncHandler(async (req, res, next) => {
    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "")

        if (!token) {
            throw new ApiError(401, "unauthorized request");
        }
        const decodedToken = jwt.verify(
            token,
            process.env.ACCESS_TOKEN_SECRET
        );

        const user = await User.findById(decodedToken?._id);

        if (!user) {
            throw new ApiError(401, "invalid access Token")
        }
        req.user = user;
        next();

    } catch (error) {
        console.log("TOKEN ERROR:", error);

        throw new ApiError(401, error?.message || "invalid access token")
    }
})

export const verifyCreator = asyncHandler(async (req, res, next) => {
    // Must run AFTER verifyJWT — relies on req.user being already set
    if (!req.user) {
        throw new ApiError(401, "unauthorized request");
    }

    if (req.user.role !== "creator") {
        throw new ApiError(403, "Only creators can perform this action");
    }

    next();
})