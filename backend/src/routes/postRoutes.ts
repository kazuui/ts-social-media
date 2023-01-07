import express from "express";
import {getAllPosts, getPost, createPost, likePost, unlikePost, editPost, deletePost, getPostFeed } from "../controllers/postController";
import {validateLoggedIn, validateAdmin} from "../middlewares/authHandler";

const router = express.Router();

//routes below require a user to be logged in
router.use(validateLoggedIn)

router.get("/all", getAllPosts);
router.post("/feed", getPostFeed)
router.post("/new", createPost)

router.get("/:postId", getPost)
router.patch("/:postId", editPost)
router.delete("/:postId", deletePost)

router.post("/:postId/like", likePost)
router.post("/:postId/unlike", unlikePost)

//routes below require a user to be an admin
router.use(validateAdmin)

export default router;