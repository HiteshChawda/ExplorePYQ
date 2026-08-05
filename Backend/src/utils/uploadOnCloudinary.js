import { v2 as cloudinary } from "cloudinary";
import fs, { access } from "fs";

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET,
});

const uploadOnCloudinary = async (
    filePath,
    resourceType = "auto"
) => {
    try {

        if (!filePath) return null;

        const result = await cloudinary.uploader.upload(filePath, {
            resource_type: resourceType,
            access_mode: "public",
        });

        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }

        return result;

    } catch (error) {

        console.log("Cloudinary Error:", error);

        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }

        return null;
    }
};

export { uploadOnCloudinary };