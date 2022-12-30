import * as yup from 'yup';
// import { User } from '@prisma/client';

const userSchema= yup.object({
    id: yup.string().uuid(),
    created_at: yup.date(),
    email: yup.string().email().nullable(),
    is_active: yup.boolean(),
    display_name: yup.string().max(100),
    profile_photo: yup.string().url(),
    profile_summary: yup.string().max(1000),
    role: yup.string()
})

export default userSchema