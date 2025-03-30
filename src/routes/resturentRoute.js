import { Router } from "express";
import {registerRestaurant} from "../controller/resturent.controller.js"
const restaurantRouter= Router();

restaurantRouter.route("/registerRestaurant").post(registerRestaurant)


export default restaurantRouter;