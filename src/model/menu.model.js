import mongoose, { Schema } from "mongoose";
const menuSchema=Schema({
    menuName:{
        required:true,
        type:String
    },
    restaurantId:{
            required:true,
            type:Schema.Types.ObjectId,
            ref:"Restaurant"
    },
    items:[{
        required:false,
        type:Schema.Types.ObjectId,
        ref:"Item"
    }]
})
export const Menu= mongoose.model('Menu',menuSchema);

