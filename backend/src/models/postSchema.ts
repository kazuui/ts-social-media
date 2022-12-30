import * as yup from 'yup';
// import { Post } from '@prisma/client';

const postSchema = yup.object({
    id: yup.number().positive().integer(),
    created_at: yup.date(),
    owner_id: yup.string().uuid(),
    description: yup.string().strict().max(1000),
    photo: yup.string().url(),
    is_active: yup.bool(),
    likes_count: yup.number().positive().integer()
})

export default postSchema