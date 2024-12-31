import {Router} from "express"
import { addMenu,getAllMenu,deleteMenu } from "../controller/menu.controller.js"
const menuRouter= Router();

menuRouter.route("/addMenu").post(addMenu)
menuRouter.route("/allMenu").get(getAllMenu)
menuRouter.route("/deletMenu").delete(deleteMenu)


export default menuRouter