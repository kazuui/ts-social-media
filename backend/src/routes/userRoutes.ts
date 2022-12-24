import express from "express";
import {getAllUsers, getUserById, createUser, logIn} from "../controllers/userController";
import {validateLoggedIn} from "../middlewares/authHandler";

const router = express.Router();

router.get("/all", validateLoggedIn, getAllUsers);
router.get("/:id", getUserById)

router.route("/createUser").post(createUser)
router.route("/login").post(logIn)

export default router;