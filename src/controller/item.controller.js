import asyncHandler from "../utills/asyncHandler.js"
import apiError from "../utills/apiError.js"
import apiResponse from "../utills/apiResponse.js"
import { Item } from "../model/item.model.js"
import { Menu } from "../model/menu.model.js"
import { uploadeOnCloudinary } from "../utills/cloudinary.js"
const addItem=asyncHandler(async(req,res)=>{
    const {itemName,itemPrice,itemImg,menuName}=req.body;
    const tempMenu = await Menu.findOne({
        menuName:menuName.trim().toUpperCase()
    });
    if (!tempMenu) {
        throw new apiError(204,"Enter correct menu name")
    }

    if(itemName.trim() === "" && itemPrice.trim() === "" && itemImg.trim === "" ){
        throw new apiError(400,"all filds is required")
    }

    const itemExist=await Item.findOne({
        itemName:itemName.trim().toUpperCase()
    })

    if(itemExist){
        throw new apiError(409,"Item already exist");
    }

    // coloudinary part
    const imgUrl= await uploadeOnCloudinary(req.file.path)
    const name =itemName.trim().toUpperCase()
    const tempitem=await Item.create({
        itemName:name,
        itemPrice:itemPrice,
        itemImg:imgUrl.secure_url
    })
    const addItem= await Item.findById(tempitem._id)
    if(!addItem){
        throw new apiError(500,"Error creating item")
    }

    await tempMenu.items.push(addItem._id)
    await tempMenu.save()

    return res.status(201).json(new apiResponse(200,addItem,"Item added Succesfully") )


})

const getAllitem = asyncHandler(async (req, res) => {
    const menus = await Menu.find().populate('items');
  
    // Transform the data to include only _id and items with itemName and itemImg
    const transformedMenus = menus.map(menu => ({
      _id: menu._id,
      items: menu.items.map(item => ({
        itemName: item.itemName,
        itemImg: item.itemImg
      }))
    }));
  
    return res.status(200).json(new apiResponse(200, transformedMenus, "allItem Successfully"));
  });
  



export{
    addItem,
    getAllitem
}