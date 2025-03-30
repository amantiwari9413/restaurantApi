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
    }
})
export const Menu= mongoose.model('Menu',menuSchema);

