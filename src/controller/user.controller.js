import asyncHandler from "../utills/asyncHandler.js"
import apiError from "../utills/apiError.js"
import { User } from "../model/user.model.js";
import apiResponse from "../utills/apiResponse.js";

const registerUser = asyncHandler(async (req, res, next) => {
   const { 
      userName,
      userEmail,
      phoneNumber,
      userType,
      userPassword 
   } = req.body;

   // Check if all required fields are provided
   if (
      !userName?.trim() ||
      !userEmail?.trim() ||
      !phoneNumber?.trim() ||
      !userType?.trim() ||
      !userPassword?.trim()
   ) {
      throw new apiError(400, "All fields are required");
   }

   // Validate email format
   const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
   if (!emailRegex.test(userEmail)) {
      throw new apiError(400, "Invalid email format");
   }

   // Validate phone number
   const phoneRegex = /^[0-9]{10}$/; // Assumes 10-digit phone number
   if (!phoneRegex.test(phoneNumber)) {
      throw new apiError(400, "Invalid phone number format. Please enter a 10-digit number");
   }
   
   // Check if user already exists by phone number
   const findUserByPhone = await User.findOne({ phoneNumber }, { phoneNumber: 1 });
   if (findUserByPhone) {
      throw new apiError(409, "User with this phone number already exists"); // 409 Conflict for existing resource
   }
   

   // Create user
   const tempUser = await User.create({
      userName,
      userEmail,
      phoneNumber,
      userType,
      userPassword
   });

   // Verify user creation
   const newUser = await User.findById(tempUser._id);

   if (!newUser) {
      throw new apiError(500, "Error while creating user!"); // 500 for server error
   }

   // Return success response
   return res.status(201).json(
      new apiResponse(201, newUser, "User registered successfully")
   );
});

export { registerUser };