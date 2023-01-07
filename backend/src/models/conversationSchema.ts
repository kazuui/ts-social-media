import * as yup from 'yup';
// import { Conversation } from '@prisma/client';

const conversationSchema = yup.object({
    id: yup.number().positive().integer(),
    created_at: yup.date(),
    updated_at: yup.date(),
    name: yup.string(),
})

export default conversationSchema