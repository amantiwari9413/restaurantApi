import {Router} from "express"
import { getOrdersByDate, placedOrder } from "../controller/orede.controller.js";

const oderRouter= Router();

oderRouter.route("/palced").post(placedOrder)
oderRouter.route("/allOrders").post(getOrdersByDate)

export default oderRouter