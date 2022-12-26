import express from "express";
import {getAllPosts, getPostById, createPost, likePostById} from "../controllers/postController";
import {validateLoggedIn, validateAdmin} from "../middlewares/authHandler";

const router = express.Router();

//routes below require a user to be logged in
router.use(validateLoggedIn)

router.get("/all", getAllPosts);
router.get("/:id", getPostById)
router.post("/createPost", createPost)
router.post("/:id/like", likePostById)
// router.route("/editprofile").patch(editUserProfile)

// router.route("/logout").post(logout)

//routes below require a user to be an admin
router.use(validateAdmin)

export default router;