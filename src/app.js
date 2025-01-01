import express from "express";
import itemRouter from "./routes/itemRoute.js";
import menuRouter from "./routes/menuRoute.js";
import oderRouter from "./routes/orderRoute.js";
import cors from "cors"
const app= express();
app.use(cors({
    origin:process.env.CORS_ORIGIN,
    credentials:true,
}))
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/item",itemRouter)
app.use("/menu",menuRouter)
app.use("/order",oderRouter)


export default app;