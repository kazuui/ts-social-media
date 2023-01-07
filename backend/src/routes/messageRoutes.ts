import express from "express";
import {getAllMessages,  createMessage} from "../controllers/messageController";
import {validateLoggedIn, validateAdmin} from "../middlewares/authHandler";

const router = express.Router();

//routes below require a user to be logged in
router.use(validateLoggedIn)

router.get("/all", getAllMessages);
// router.get("/conversation/:conversationId", getMessagesByConversationId)
router.post("/new/:conversationId", createMessage)

//routes below require a user to be an admin
router.use(validateAdmin)

export default router;