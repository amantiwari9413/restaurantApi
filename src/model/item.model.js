import {mongoose,Schema} from "mongoose";

const itemSchema=Schema({
    itemName:{
        required:true,
        type:String
    },
    itemPrice:{
        required:true,
        type:String
    },
    itemImg:{
        required:true,
        type:String
    },
    menuId:{
        required:true,
        type:Schema.Types.ObjectId,
        ref:"Menu"
    },
    restaurantId:{
        required:true,
        type:Schema.Types.ObjectId,
        ref:"Restaurant"
}
})


export const Item= mongoose.model('Items',itemSchema);
