import express from "express";
import {getAllConversations,getConversationsByUserId,  createConversation, editConversationMembers, editConversationDetails} from "../controllers/conversationController";
import {validateLoggedIn, validateAdmin} from "../middlewares/authHandler";

const router = express.Router();

//routes below require a user to be logged in
router.use(validateLoggedIn)

router.get("/all", getAllConversations);
router.get("/:userId", getConversationsByUserId)
router.post("/new", createConversation)
router.patch("/:conversationId/edit/members", editConversationMembers)
router.patch("/:conversationId/edit", editConversationDetails)

//routes below require a user to be an admin
router.use(validateAdmin)

export default router;