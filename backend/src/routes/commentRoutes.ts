import express from "express";
import {getAllComments,getPostComments,  createComment, getComment, likeComment, unlikeComment, editComment, deleteComment, getPostPaginatedComments} from "../controllers/commentController";
import {validateLoggedIn, validateAdmin} from "../middlewares/authHandler";

const router = express.Router();

//routes below require a user to be logged in
router.use(validateLoggedIn)

router.get("/all", getAllComments);
router.post("/post/:postId/feed", getPostPaginatedComments) // will change route name
router.get("/post/:postId", getPostComments)
router.post("/new/:postId", createComment)
router.post("/:commentId/like", likeComment)
router.post("/:commentId/unlike", unlikeComment)
router.get("/:commentId", getComment)
router.patch("/:commentId", editComment)
router.delete("/:commentId", deleteComment)


//routes below require a user to be an admin
// router.use(validateAdmin)

export default router;