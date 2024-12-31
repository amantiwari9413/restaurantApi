import {Router} from "express"
import { addItem,getAllitem } from "../controller/item.controller.js";

const itemRouter= Router();

itemRouter.route("/addItem").post(addItem)
itemRouter.route("/getAllItem").get(getAllitem)
itemRouter.route("/deletItem").post()
export default itemRouter;