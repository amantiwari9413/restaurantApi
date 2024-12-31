import mongoose, { Schema } from "mongoose";
const menuSchema=Schema({
    menuName:{
        required:true,
        type:String
    },
    items:[
        {
            required:false,
            type:Schema.Types.ObjectId,
            ref:"Items"
        }
    ]
})
export const Menu= mongoose.model('Menu',menuSchema);

