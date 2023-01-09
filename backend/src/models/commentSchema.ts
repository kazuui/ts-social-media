import * as yup from 'yup';
// import { Comment } from '@prisma/client';

const commentSchema = yup.object({
    id: yup.number().positive().integer(),
    created_at: yup.date(),
    updated_at: yup.date(),
    owner_id: yup.string().uuid(),
    post_id: yup.number().positive().integer(),
    description: yup.string().max(1000),
    is_active: yup.bool(),
})

export default commentSchema