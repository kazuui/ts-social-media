import express from "express";
import {getAllUsers, getUserById, createUser} from "../controllers/userController";

const router = express.Router();

router.get("/all", getAllUsers);
router.get("/:id", getUserById)

router.route("/createUser").post(createUser)

export default router;