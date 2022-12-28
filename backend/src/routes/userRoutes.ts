import express from "express";
import {getAllUsers, getUserById, editUserProfile, signup, login, logout} from "../controllers/userController";
import {validateLoggedIn, validateAdmin} from "../middlewares/authHandler";

const router = express.Router();

router.route("/login").post(login)
router.route("/signup").post(signup)

//routes below require a user to be logged in
router.use(validateLoggedIn)

router.get("/all", getAllUsers);
router.get("/:id", getUserById)
router.route("/editprofile").patch(editUserProfile)

router.route("/logout").post(logout)

//routes below require a user to be an admin
router.use(validateAdmin)

export default router;