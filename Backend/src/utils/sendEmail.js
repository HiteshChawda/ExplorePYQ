import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    host: process.env.BREVO_SMTP_HOST,
    port: process.env.BREVO_SMTP_PORT,
    secure: false, // Brevo uses STARTTLS on port 587, not implicit TLS
    auth: {
        user: process.env.BREVO_SMTP_USER,
        pass: process.env.BREVO_SMTP_PASS,
    },
});

export const sendOtpEmail = async (toEmail, otp) => {
    await transporter.sendMail({
        from: process.env.EMAIL_FROM,
        to: toEmail,
        subject: "Your ExplorePYQ Creator Verification Code",
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 480px; margin: auto;">
                <h2>Verify your Creator account</h2>
                <p>Use the code below to verify your email and activate your Creator account on ExplorePYQ.</p>
                <p style="font-size: 28px; font-weight: bold; letter-spacing: 4px;">${otp}</p>
                <p>This code expires in 10 minutes. If you didn't request this, you can safely ignore this email.</p>
            </div>
        `,
    });
};