import * as yup from 'yup';
// import { Message } from '@prisma/client';

const messageSchema = yup.object({
    id: yup.number().positive().integer(),
    created_at: yup.date(),
    user_id: yup.string().uuid(),
    content: yup.string().max(1000),
    conversation_id: yup.number().positive().integer()
})

export default messageSchema