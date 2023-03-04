import express from "express";
import {getAllConversations,getUserConversations, getConversationMessages, createConversation, editConversationMembers, editConversationDetails, getAllMessages, createMessage} from "../controllers/conversationController";
import {validateLoggedIn, validateAdmin} from "../middlewares/authHandler";

const router = express.Router();

//routes below require a user to be logged in
router.use(validateLoggedIn)

router.get("/all", getAllConversations);
router.get("/messages/all", getAllMessages);
router.post("/messages/:conversationId", createMessage)
router.post("/new", createConversation)
router.get("/user", getUserConversations)
router.post("/:conversationId", getConversationMessages)
router.patch("/:conversationId/edit/members", editConversationMembers)
router.patch("/:conversationId/edit", editConversationDetails)

//routes below require a user to be an admin
// router.use(validateAdmin)

export default router;