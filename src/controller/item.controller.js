import asyncHandler from "../utills/asyncHandler.js"
import apiError from "../utills/apiError.js"
import apiResponse from "../utills/apiResponse.js"
import { Item } from "../model/item.model.js"
import { Menu } from "../model/menu.model.js"
import {Restaurant} from "../model/resturent.model.js"
import { uploadeOnCloudinary } from "../utills/cloudinary.js"


const addItem=asyncHandler(async(req,res)=>{
    const {itemName,itemPrice,itemImg,menuId,}=req.body;

    if(itemName.trim() === "" && itemPrice.trim() === "" && itemImg.trim === "" ){
        throw new apiError(400,"all filds is required")
    };

    const tempMenu = await Menu.findOne({
        _id:menuId
    });
    
    if (!tempMenu) {
        throw new apiError(204,"Menu not found")
    };

    // coloudinary part
    const imgUrl= await uploadeOnCloudinary(req.file.path)
    const name =itemName.trim().toUpperCase()
    const tempitem=await Item.create({
        itemName:name,
        itemPrice:itemPrice,
        itemImg:imgUrl.secure_url,
        restaurantId:tempMenu.restaurantId,
        menuId:tempMenu._id
    });

    const addItem= await Item.findById(tempitem._id)
    if(!addItem){
        throw new apiError(500,"Error creating item")
    };

    await tempMenu.items.push(addItem._id);
    await tempMenu.save();
    return res.status(201).json(new apiResponse(200,addItem,"Item added Succesfully") );
})

const getAllItems = asyncHandler(async (req, res) => {
    const { restaurantId } = req.query;
    
    // Check if restaurantId is provided
    if (!restaurantId) {
        throw new apiError(400, "Please provide restaurantId parameter");
    }
    
    // Validate restaurant exists
    const tempRestaurant = await Restaurant.findOne({
        _id: restaurantId
    });
    
    if (!tempRestaurant) {
        throw new apiError(204, "Restaurant not found");
    }
    
    // Find all items for this restaurant
    const items = await Item.find({ restaurantId })
        .populate('menuId', 'menuName')
        .populate('restaurantId', 'name');
    
    return res.status(200).json(
        new apiResponse(200, items, "Items fetched successfully")
    );
});


const getItemByMenuId = asyncHandler(async (req, res) => {
    const { menuId } = req.query;
    
    // Check if menuId is provided
    if (!menuId) {
        throw new apiError(400, "Please provide menuId parameter");
    }
    
    // Validate menu exists
    const tempMenu = await Menu.findOne({ _id: menuId });
    
    if (!tempMenu) {
        throw new apiError(204, "Menu not found");
    }
    
    // Find all items for this menu
    const items = await Item.find({ menuId })
        .populate('menuId', 'menuName')
        .populate('restaurantId', 'name');
    console.log()
    return res.status(200).json(
        new apiResponse(200, items, "Items fetched successfully")
    );
});


const deleteItem = asyncHandler(async (req, res) => {
    const { itemId } = req.query;
    
    // Check if itemId is provided
    if (!itemId) {
        throw new apiError(400, "Please provide itemId parameter");
    }
    
    // Find and delete the item
    const deletedItem = await Item.findByIdAndDelete(itemId);
    
    if (!deletedItem) {
        throw new apiError(404, "Item not found");
    }
    
    return res.status(200).json(
        new apiResponse(200, deletedItem, "Item deleted successfully")
    );
});

export{
    addItem,
    getAllItems,
    getItemByMenuId,
    deleteItem
}