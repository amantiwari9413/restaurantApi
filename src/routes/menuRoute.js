import {Router} from "express"
import { addMenu,getAllMenus,deleteMenu } from "../controller/menu.controller.js"
const menuRouter= Router();

menuRouter.route("/addMenu").post(addMenu)
menuRouter.route("/allMenu").get(getAllMenus)
menuRouter.route("/deletMenu").delete(deleteMenu)


export default menuRouter