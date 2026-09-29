import express from "express";

import {
    registerUser,
    verifyEmail,
    resendVerificationOTP,
    loginUser
} from "../controllers/authController.js";

const router = express.Router();

router.post("/register", registerUser);

router.post("/verify-email", verifyEmail);

router.post("/resend-verification", resendVerificationOTP); 

router.post("/login", loginUser);

export default router;
