import { Restaurant } from '../model/resturent.model.js';
import apiError  from '../utills/apiError.js';
import  apiResponse  from '../utills/apiResponse.js';
import  asyncHandler  from '../utills/asyncHandler.js';


const registerRestaurant = asyncHandler(async (req, res, next) => {
    const {
        name,
        address,
        phone,
        email,
        password
    } = req.body;

    // Check if all required fields are provided
    if (
        !name?.trim() ||
        !phone?.trim() ||
        !email?.trim() ||
        !password?.trim()
    ) {
        throw new apiError(400, "All fields are required");
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        throw new apiError(400, "Invalid email format");
    }

    // Validate phone number
    const phoneRegex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
    if (!phoneRegex.test(phone)) {
        throw new apiError(400, "Invalid phone number format");
    }

    // Validate password strength
    if (password.length < 8) {
        throw new apiError(400, "Password must be at least 8 characters long");
    }

    // Check if restaurant already exists by phone number
    const findRestaurantByPhone = await Restaurant.findOne({ phone });
    if (findRestaurantByPhone) {
        throw new apiError(409, "Restaurant with this phone number already exists");
    }

    // Check if restaurant already exists by email
    const findRestaurantByEmail = await Restaurant.findOne({ email });
    if (findRestaurantByEmail) {
        throw new apiError(409, "Restaurant with this email already exists");
    }

    // Create restaurant
    const newRestaurant = await Restaurant.create({
        name,
        address,
        phone,
        email,
        password
    });

    // Verify restaurant creation
    const createdRestaurant = await Restaurant.findById(newRestaurant._id).select('-password');

    if (!createdRestaurant) {
        throw new apiError(500, "Error while creating restaurant");
    }

    // Return success response
    return res.status(201).json(
        new apiResponse(201, createdRestaurant, "Restaurant registered successfully")
    );
});

export { registerRestaurant };