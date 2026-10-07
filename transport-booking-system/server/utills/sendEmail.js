import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

export const sendEmail = async (to, subject, html) => {
    try {
        const mailOptions = {
            from: `"BlueWhales Transport" <${process.env.EMAIL_USER}>`,
            to,
            subject,
            html,
            text: "Your BlueWhales email verification code is included in this email. It expires in 10 minutes.",
        };

        const info = await transporter.sendMail(mailOptions);

        console.log("Email sent:", info.messageId);
        console.log("Accepted:", info.accepted);
        console.log("Rejected:", info.rejected);

        return info;

    } catch (error) {
        console.error("Email sending error:", error);
        throw error;
    }
};