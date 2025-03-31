import {Router} from "express"
import { addItem,getAllItems,deleteItem,getItemByMenuId } from "../controller/item.controller.js";

const itemRouter= Router();

itemRouter.route("/addItem").post(addItem);
itemRouter.route("/allItem").get(getAllItems);
itemRouter.route("/itembyMenuid").get(getItemByMenuId)
itemRouter.route("/deletItem").delete(deleteItem);
export default itemRouter;