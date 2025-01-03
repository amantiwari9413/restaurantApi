import asyncHandler from "../utills/asyncHandler.js"
import apiError from "../utills/apiError.js"
import apiResponse from "../utills/apiResponse.js"
import  {Menu} from "../model/menu.model.js"
const addMenu=asyncHandler(async(req,res)=>{
    const {menuName} = req.body;
    if(menuName.trim() === ""){
        throw new apiError(400,"All fields are required")
    }

    // check userName is unique 
    const menuExist=await Menu.findOne({
        menuName:menuName.trim().toUpperCase()
    })
    
    if(menuExist){
        throw new apiError(409,"Menu already exist");
    }

    const tempMenu=await Menu.create({
        menuName:menuName.trim().toUpperCase(),
    })
    const addMenu= await Menu.findById(tempMenu._id)
    if(!addMenu){
        throw new apiError(500,"Error creating menu")
    }

    return res.status(201).json(new apiResponse(200,addMenu,"Menu added Succesfully") )


})

const getAllMenu = asyncHandler(async (req, res) => {
    // Query the database to fetch only the `menuName` field
    const menus = await Menu.find().select("menuName"); // Include only menuName field

    if (!menus || menus.length === 0) {
        throw new apiError(204, "No menu found");
    }

    return res
        .status(200)
        .json(new apiResponse(200, menus, "All menu names sent successfully"));
});



const deleteMenu=asyncHandler(async(req,res)=>{
    let {menuName}=req.body
    menuName=menuName.trim().toUpperCase();
    const result = await Menu.deleteOne({ menuName }); // Deletes the menu
        if (result.deletedCount === 0) {
            throw new apiError(204,"No menu found with the given name.")
        } else {
            res.status(204).json(new apiResponse(200,{message:"Menu deleted succefully"},""))
        }
})


export {
    addMenu,
    getAllMenu,
    deleteMenu
}