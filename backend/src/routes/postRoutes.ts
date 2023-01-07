import express from "express";
import {getAllPosts, getPostById, createPost, likePostById, unlikePostById, getPostFeed } from "../controllers/postController";
import {validateLoggedIn, validateAdmin} from "../middlewares/authHandler";

const router = express.Router();

//routes below require a user to be logged in
router.use(validateLoggedIn)

router.get("/all", getAllPosts);
router.post("/feed", getPostFeed)
router.post("/createPost", createPost)


router.get("/:postId", getPostById)
router.post("/:postId/like", likePostById)
router.post("/:postId/unlike", unlikePostById)

//routes below require a user to be an admin
router.use(validateAdmin)

export default router;