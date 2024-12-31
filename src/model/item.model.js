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
    }
})


export const Item= mongoose.model('Items',itemSchema);
