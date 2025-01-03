import asyncHandler from "../utills/asyncHandler.js";
import apiError from "../utills/apiError.js";
import apiResponse from "../utills/apiResponse.js";
import { Order } from "../model/order.model.js";
import mongoose from "mongoose";

const placedOrder = asyncHandler(async (req, res) => {
    const { customerName, customerNumber, orderedItems,tableNumber} = req.body;

    // Check for empty fields
    if ([customerName, customerNumber].some((field) => field?.trim() === "")) {
        throw new apiError(400, "All fields are required");
    }

    // Validate each itemId in orderedItems
    if (
        !Array.isArray(orderedItems) ||
        orderedItems.some(
            (item) =>
                !item.itemId ||
                !mongoose.Types.ObjectId.isValid(item.itemId) // Validate ObjectId
        )
    ) {
        throw new apiError(400, "Invalid itemId in orderedItems");
    }

    // Create the order
    const tempOrder = await Order.create({
        customerName,
        customerNumber,
        orderedItems,
        tableNumber,
    });

    // Fetch the newly created order
    const placedOrder = await Order.findById(tempOrder._id);

    if (!placedOrder) {
        throw new apiError(400, "Error while placing order");
    }

    return res
        .status(201)
        .json(new apiResponse(200, placedOrder, "Order placed successfully"));
});

const getOrdersByDate = asyncHandler(async (req, res) => {
    const { startDate, endDate } = req.query;

    // Log the query parameters for debugging
    console.log('Start Date:', startDate);
    console.log('End Date:', endDate);

    const start = new Date(startDate + 'T00:00:00Z');  // Start at midnight UTC
    const end = new Date(endDate + 'T23:59:59Z');    // End at the last moment of the endDate in UTC


    if (isNaN(start.getTime()) || isNaN(end.getTime())) { 
        throw new apiError(400, "Invalid date format");
    }

    const orders = await Order.find({
        createdAt: { $gte: start, $lte: end }, // Ensure correct date range
    });

    return res.status(200).json(new apiResponse(200, orders, "Orders retrieved successfully"));
});




export { placedOrder,getOrdersByDate };
