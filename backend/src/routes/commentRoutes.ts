import express from "express";
import {getAllComments,getCommentsByPostId,  createComment, likeCommentById} from "../controllers/commentController";
import {validateLoggedIn, validateAdmin} from "../middlewares/authHandler";

const router = express.Router();

//routes below require a user to be logged in
router.use(validateLoggedIn)

router.get("/all", getAllComments);
router.get("/post/:postId", getCommentsByPostId)
router.post("/new/:postId", createComment)
router.post("/:commentId/like", likeCommentById)

//routes below require a user to be an admin
router.use(validateAdmin)

export default router;