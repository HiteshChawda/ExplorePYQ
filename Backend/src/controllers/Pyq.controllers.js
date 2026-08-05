import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { uploadOnCloudinary } from "../utils/uploadOnCloudinary.js";
import { Pyq } from "../models/pyq.model.js";

const uploadPyq = asyncHandler(async (req, res) => {
  const { branch, semester, subject, year } = req.body;

  if (!branch || !semester || !subject || !year) {
    throw new ApiError(400, "All fields are required");
  }

  if (!req.file) {
    throw new ApiError(400, "PDF file is required");
  }

  const uploadedPdf = await uploadOnCloudinary(req.file.path, "raw");
  console.log(uploadedPdf);
  
  if (!uploadedPdf) {
    throw new ApiError(500, "PDF upload failed");
  }

  const pyq = await Pyq.create({
    owner: req.user._id,
    branch,
    semester,
    subject,
    year,
    pdf: uploadedPdf.secure_url,
    publicId: uploadedPdf.public_id,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, pyq, "PYQ uploaded successfully"));
});

const getAllPyqs = asyncHandler(async (req, res) => {
  const pyqs = await Pyq.find()
    .populate("owner", "username fullName")
    .sort({ createdAt: -1 });

  return res
    .status(200)
    .json(new ApiResponse(200, pyqs, "PYQs fetched successfully"));
});

const deletePyq = asyncHandler(async (req, res) => {
  const pyq = await Pyq.findById(req.params.id);

  if (!pyq) {
    throw new ApiError(404, "PYQ not found");
  }

  if (pyq.owner.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "You are not allowed to delete this PYQ");
  }

  await Pyq.findByIdAndDelete(req.params.id);

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "PYQ deleted successfully"));
});

export { uploadPyq, getAllPyqs, deletePyq };
