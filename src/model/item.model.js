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
    menuName:{
        required:true,
        type:String
    },
    restaurantName:{
        required:false,
        type:Schema.Types.ObjectId,
        ref:"Restaurant"
}
})


export const Item= mongoose.model('Items',itemSchema);
