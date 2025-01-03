import { mongoose, Schema } from "mongoose";

const orderSchema = new Schema(
  {
    customerName: {
      type: String,
      required: true,
    },
    customerNumber: {
      type: String,
      required: true,
    },
    tableNumber:{
      type: String,
      required: true,
    },
    orderedItems: [
      {
        itemId: { type: Schema.Types.ObjectId, required: true },
        itemName: { type: String, required: true },
        itemQuantity: { type: Number, required: true },
        itemPrice: { type: Number, required: true }, // Add a price field for each item
      },
    ],
    totalAmount: {
      type: Number,
      default: 0, // Default to 0 initially
    },
    orderStatus:{
        type:String,
        default:"Panding"
    }
  },
  {
    timestamps: true,
  }
);

// Pre-save hook to calculate totalAmount
orderSchema.pre("save", function (next) {
  this.totalAmount = this.orderedItems.reduce((total, item) => {
    return total + item.itemQuantity * item.itemPrice;
  }, 0);
  next();
});

export const Order= mongoose.model('Order',orderSchema);
