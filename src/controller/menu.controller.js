import asyncHandler from "../utills/asyncHandler.js"
import apiError from "../utills/apiError.js"
import apiResponse from "../utills/apiResponse.js"
import { Menu } from "../model/menu.model.js";
import { Restaurant } from "../model/resturent.model.js";
import mongoose from "mongoose";

const addMenu = asyncHandler(async (req, res) => {
    const { menuName, restaurantID } = req.body;

    if (!menuName || !restaurantID) {
        throw new apiError(400, "Menu name and restaurant ID are required");
    }

    if (menuName.trim() === "") {
        throw new apiError(400, "Menu name cannot be empty");
    }

    // Validate restaurantID format
    if (!restaurantID.match(/^[0-9a-fA-F]{24}$/)) {
        throw new apiError(400, "Invalid restaurant ID format");
    }

    // Check if the restaurant exists
    const restaurantExists = await Restaurant.findById(restaurantID);
    if (!restaurantExists) {
        throw new apiError(404, "Restaurant not found");
    }

    // Check if the menu already exists for this restaurant
    const menuExist = await Menu.findOne({
        menuName: menuName.trim().toUpperCase(),
        restaurantId: restaurantID,
    });

    if (menuExist) {
        throw new apiError(409, "Menu already exists for this restaurant");
    }

    // Create the new menu entry
    const newMenu = await Menu.create({
        menuName: menuName.trim().toUpperCase(),
        restaurantId: restaurantID,
    });

    if (!newMenu) {
        throw new apiError(500, "Error creating menu");
    }

    restaurantExists.menus.push(newMenu._id);
    await restaurantExists.save();

    return res.status(201).json(new apiResponse(201, newMenu, "Menu added successfully"));
});


const getAllMenus = asyncHandler(async (req, res) => {
    const { restaurantId } = req.query;

    // Validate if restaurantId is provided
    if (!restaurantId) {
        throw new apiError(400, "Restaurant ID is required");
    }

    // Find restaurant and populate just the menuName from the menus
    const restaurant = await Restaurant.findById(restaurantId)
        .populate({
            path: 'menus',
            select: 'menuName'
        });

    if (!restaurant) {
        throw new apiError(404, "Restaurant not found");
    }

    if (!restaurant.menus || restaurant.menus.length === 0) {
        return res
            .status(200)
            .json(new apiResponse(200, [], "No menus found for this restaurant"));
    }

    return res
        .status(200)
        .json(new apiResponse(200, restaurant.menus, "All menu names for restaurant sent successfully"));
});

const deleteMenu = asyncHandler(async (req, res) => {
    const { menuId } = req.query; 

    if (!menuId) {
        throw new apiError(400, "Menu ID is required");
    }

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const menuToDelete = await Menu.findById(menuId).session(session);

        if (!menuToDelete) {
            throw new apiError(404, "No menu found with the given ID");
        }

        const updateResult = await Restaurant.updateMany(
            { menus: menuId },
            { $pull: { menus: menuId } },
            { session }
        );

        const deleteResult = await Menu.findByIdAndDelete(menuId).session(session);

        await session.commitTransaction();
        session.endSession();

        return res
            .status(200)
            .json(new apiResponse(
                200,
                {
                    menuDeleted: deleteResult.menuName,
                    restaurantsUpdated: updateResult.modifiedCount
                },
                "Menu deleted successfully and restaurant references updated"
            ));
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        throw error;
    }
});

export {
    addMenu,
    getAllMenus,
    deleteMenu
}