import { Router } from "express";
import { loginUser, logoutUser, registerUser, refreshAccessToken, getCurrentUser, verifyOtp, resendOtp } from "../controllers/user.controllers.js";
import {upload} from "../middlewares/multer.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/register").post(registerUser);

router.route("/verify-otp").post(verifyOtp);

router.route("/resend-otp").post(resendOtp);

router.route("/login").post(loginUser)

router.route("/logout").post(verifyJWT, logoutUser)

router.route("/refresh-token").post(refreshAccessToken)

router.route("/current-user").get(verifyJWT, getCurrentUser)

export default router;