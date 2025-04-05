import { User } from "../models/users.models.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const registerUser = asyncHandler(async (req, res) => {
  // Get user details from request
  const { fullName, email, phoneNumber, enrollmentNumber, courseType, semester, year, clubs } = req.body;

  // Validation - check if all required fields are provided
  if (
    [fullName, email, phoneNumber, enrollmentNumber, courseType, semester, year].some(
      (field) => !field || field.trim() === ""
    )
  ) {
    throw new ApiError(400, "All fields are required");
  }

  // Check if user already exists
  const existingUser = await User.findOne({
    $or: [{ email }, { enrollmentNumber }]
  });

  if (existingUser) {
    throw new ApiError(409, "User with this email or enrollment number already exists");
  }


// idCard file checking part
const idCardLocalPath = req.files?.idCard?.[0]?.path;
  
if (!idCardLocalPath) {
  throw new ApiError(400, "ID Card file is required");
}

  // Upload ID card to cloudinary
  const idCard = await uploadOnCloudinary(idCardLocalPath);
  
  if (!idCard.url) {
    throw new ApiError(500, "Error uploading ID card");
  }

  // Generate a temporary password (you might want to implement email verification instead)
  const tempPassword = Math.random().toString(36).slice(-8);

  // Create user object
  const user = await User.create({
    fullName,
    email,
    phoneNumber,
    enrollmentNumber,
    courseType,
    semester: parseInt(semester),
    year: parseInt(year),
    idCard: idCard.url,
    clubs: Array.isArray(clubs) ? clubs : [clubs],
    password: tempPassword  // In a production app, implement email verification and let users set their own password
  });

  // Remove password field from response
  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while registering the user");
  }

  // Return success response
  return res.status(201).json(
    new ApiResponse(201, createdUser, "User registered successfully", tempPassword)
  );
});

// Controller to get user details (for admin or personal dashboard)
const getUserDetails = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  const user = await User.findById(userId).select("-password -refreshToken");

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  return res.status(200).json(
    new ApiResponse(200, user, "User details fetched successfully")
  );
});

// Controller to get users by club
const getUsersByClub = asyncHandler(async (req, res) => {
  const { club } = req.params;

  const users = await User.find({
    clubs: club
  }).select("-password -refreshToken");

  return res.status(200).json(
    new ApiResponse(200, users, "Users fetched successfully")
  );
});

export { registerUser, getUserDetails, getUsersByClub };