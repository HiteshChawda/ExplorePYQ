export const generateOtp = () => {
    // 6-digit numeric OTP
    return Math.floor(100000 + Math.random() * 900000).toString();
};

export const getOtpExpiry = () => {
    // OTP valid for 10 minutes
    return new Date(Date.now() + 10 * 60 * 1000);
};