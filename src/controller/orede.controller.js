import asyncHandler from "../utills/asyncHandler.js";
import apiError from "../utills/apiError.js";
import apiResponse from "../utills/apiResponse.js";
import { Order } from "../model/order.model.js";
import { User } from "../model/user.model.js";

const isValidPhoneNumber = (number) => {
    const phoneRegex = /^\+?[0-9]{10,15}$/;
    return phoneRegex.test(number);
};

const placedOrder = asyncHandler(async (req, res) => {
    const { customerName, customerNumber, orderedItems, tableNumber } = req.body;

    if (!customerName?.trim() || !customerNumber?.trim()) {
        throw new apiError(400, "All fields are required");
    }

    if (!isValidPhoneNumber(customerNumber)) {
        throw new apiError(400, "Invalid phone number format. Use a valid 10-15 digit number.");
    }

    let user = await User.findOne({ phoneNumber: customerNumber });

    if (!user) {
        user = await User.create({
            userName: customerName,
            phoneNumber: customerNumber,
            userEmail: `${customerNumber}@example.com`,
            userType: "customer",
            userPassword: "default123",
        });

        if (!user) {
            throw new apiError(500, "User registration failed");
        }
    }

    const tempOrder = await Order.create({
        customerName,
        customerNumber,
        orderedItems,
        tableNumber,
    });

    const placedOrder = await Order.findById(tempOrder._id);

    if (!placedOrder) {
        throw new apiError(400, "Error while placing order");
    }

    return res.status(201).json(new apiResponse(201, placedOrder, "Order placed successfully"));
});

const getOrdersByDate = asyncHandler(async (req, res) => {
    const { startDate, endDate } = req.query;

    console.log('Start Date:', startDate);
    console.log('End Date:', endDate);

    const start = new Date(startDate + 'T00:00:00Z');
    const end = new Date(endDate + 'T23:59:59Z');

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
        throw new apiError(400, "Invalid date format");
    }

    const orders = await Order.find({
        createdAt: { $gte: start, $lte: end },
    });

    return res.status(200).json(new apiResponse(200, orders, "Orders retrieved successfully"));
});

const getAllOrders = asyncHandler(async (req, res) => {
    const orders = await Order.find().sort({ createdAt: -1 });

    return res.status(200).json(new apiResponse(200, orders, "All orders retrieved successfully"));
});

export { placedOrder, getOrdersByDate, getAllOrders };
