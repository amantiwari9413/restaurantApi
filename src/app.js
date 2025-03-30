import express from "express";
import itemRouter from "./routes/itemRoute.js";
import menuRouter from "./routes/menuRoute.js";
import oderRouter from "./routes/orderRoute.js";
import userRouter from "./routes/userRoute.js";
import restaurantRouter from "./routes/resturentRoute.js";
import { upload } from "./middlewares/multer.middlewares.js";
import cors from "cors"
const app= express();
app.use(cors({
    origin:process.env.CORS_ORIGIN,
    credentials:true,
}))
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/item",upload.single('itemImg'),itemRouter)
app.use("/menu",menuRouter)
app.use("/order",oderRouter)
app.use("/user",userRouter)
app.use("/restaurant",restaurantRouter)

export default app;