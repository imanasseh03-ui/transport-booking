import bcrypt from "bcrypt";
import pool from "../config/db.js";
import generateToken from "../utills/generateToken.js";
import { generateOTP } from "../utills/generateOTP.js";
import { sendEmail } from "../utills/sendEmail.js";


// ===============================
// REGISTER USER
// ===============================

export const registerUser = async (req, res) => {
    try {
        const { full_name, email, phone, password } = req.body;

        if (!full_name || !email || !phone || !password) {
            return res.status(400).json({
                message: "All fields are required",
            });
        }

        // Check if email already exists
        const existingUser = await pool.query(
            "SELECT * FROM users WHERE email = $1",
            [email]
        );

        if (existingUser.rows.length > 0) {
            return res.status(400).json({
                message: "Email already exists",
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user
        const result = await pool.query(
            `INSERT INTO users
            (
                full_name,
                email,
                phone,
                password,
                email_verified
            )
            VALUES
            ($1, $2, $3, $4, false)
            RETURNING
                id,
                full_name,
                email,
                phone,
                role`,
            [
                full_name,
                email,
                phone,
                hashedPassword,
            ]
        );

        const user = result.rows[0];


        // ===============================
        // GENERATE OTP
        // ===============================

        const otp = generateOTP();

        const expiresAt = new Date(
            Date.now() + 10 * 60 * 1000
        );


        // ===============================
        // SAVE OTP
        // ===============================

        await pool.query(
            `INSERT INTO email_verifications
            (
                user_id,
                otp_code,
                expires_at
            )
            VALUES
            ($1, $2, $3)`,
            [
                user.id,
                otp,
                expiresAt,
            ]
        );


        // ===============================
        // EMAIL CONTENT
        // ===============================

        const emailContent = `
            <div style="
                font-family: Arial, sans-serif;
                max-width: 600px;
                margin: auto;
                padding: 30px;
                border: 1px solid #e5e7eb;
                border-radius: 10px;
            ">

                <h2 style="color: #1769aa;">
                    Welcome to Bluewhales
                </h2>

                <p>
                    Hello ${user.full_name},
                </p>

                <p>
                    Thank you for creating your Bluewhales account.
                    Please use the verification code below to verify
                    your email address.
                </p>

                <div style="
                    font-size: 32px;
                    font-weight: bold;
                    letter-spacing: 8px;
                    text-align: center;
                    margin: 30px 0;
                    color: #1769aa;
                ">
                    ${otp}
                </div>

                <p>
                    This code will expire in
                    <strong>10 minutes</strong>.
                </p>

                <p>
                    If you did not create a Bluewhales account,
                    you can safely ignore this email.
                </p>

                <p style="margin-top: 30px;">
                    Regards,<br>
                    <strong>Bluewhales Transport</strong>
                </p>

            </div>
        `;


        // ===============================
        // SEND EMAIL
        // ===============================

        await sendEmail(
            user.email,
            "Verify your Bluewhales account",
            emailContent
        );


        // Do NOT issue a JWT yet.
        // The user must verify their email first.

        res.status(201).json({
            message:
                "Registration successful. Verification code sent to your email.",

            user: {
                id: user.id,
                full_name: user.full_name,
                email: user.email,
                phone: user.phone,
                role: user.role,
            },
        });

    } catch (error) {

        console.error("Registration error:", error);

        res.status(500).json({
            message: "Registration failed",
        });
    }
};


// ===============================
// VERIFY EMAIL
// ===============================

export const verifyEmail = async (req, res) => {
    try {

        const { email, otp } = req.body;


        if (!email || !otp) {
            return res.status(400).json({
                message:
                    "Email and verification code are required",
            });
        }


        // Find user
        const userResult = await pool.query(
            `
            SELECT id, email, email_verified
            FROM users
            WHERE email = $1
            `,
            [email]
        );


        if (userResult.rows.length === 0) {
            return res.status(404).json({
                message: "User not found",
            });
        }


        const user = userResult.rows[0];


        // Check if already verified
        if (user.email_verified) {
            return res.status(400).json({
                message: "Email is already verified",
            });
        }


        // Get latest OTP
        const otpResult = await pool.query(
            `
            SELECT
                id,
                otp_code,
                expires_at,
                verified
            FROM email_verifications
            WHERE user_id = $1
            ORDER BY created_at DESC
            LIMIT 1
            `,
            [user.id]
        );


        if (otpResult.rows.length === 0) {
            return res.status(400).json({
                message: "No verification code found",
            });
        }


        const verification = otpResult.rows[0];


        // Check if OTP has already been used
        if (verification.verified) {
            return res.status(400).json({
                message:
                    "This verification code has already been used",
            });
        }


        // Check expiration
        if (
            new Date() >
            new Date(verification.expires_at)
        ) {
            return res.status(400).json({
                message: "Verification code has expired",
            });
        }


        // Check OTP
        if (
            verification.otp_code !==
            otp.toString()
        ) {
            return res.status(400).json({
                message: "Invalid verification code",
            });
        }


        // Mark OTP as verified
        await pool.query(
            `
            UPDATE email_verifications
            SET verified = true
            WHERE id = $1
            `,
            [verification.id]
        );


        // Mark user's email as verified
        await pool.query(
            `
            UPDATE users
            SET email_verified = true
            WHERE id = $1
            `,
            [user.id]
        );


        res.json({
            success: true,
            message:
                "Email verified successfully. You can now log in.",
        });

    } catch (error) {

        console.error(
            "Email verification error:",
            error
        );

        res.status(500).json({
            message: "Email verification failed",
        });
    }
};


// ===============================
// LOGIN USER
// ===============================

export const loginUser = async (req, res) => {
    try {

        const { email, password } = req.body;


        if (!email || !password) {
            return res.status(400).json({
                message:
                    "Email and password are required",
            });
        }


        // Find user
        const result = await pool.query(
            "SELECT * FROM users WHERE email = $1",
            [email]
        );


        if (result.rows.length === 0) {
            return res.status(401).json({
                message:
                    "Invalid email or password",
            });
        }


        const user = result.rows[0];


        // Check password
        const isMatch = await bcrypt.compare(
            password,
            user.password
        );


        if (!isMatch) {
            return res.status(400).json({
                message:
                    "Invalid email or password",
            });
        }


        // ===============================
        // CHECK EMAIL VERIFICATION
        // ===============================

        if (!user.email_verified) {
            return res.status(403).json({
                message:
                    "Please verify your email before logging in.",
                emailVerified: false,
            });
        }


        // ===============================
        // LOGIN SUCCESS
        // ===============================

        res.json({
            message: "Login successful",

            token: generateToken(
                user.id,
                user.role
            ),

            user: {
                id: user.id,
                full_name: user.full_name,
                email: user.email,
                phone: user.phone,
                role: user.role,
            },
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Server error",
        });
    }
};

