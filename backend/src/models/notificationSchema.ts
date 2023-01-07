import * as yup from 'yup';
// import { Notification } from '@prisma/client';

const notificationSchema = yup.object({
    id: yup.number().positive().integer(),
    created_at: yup.date(),
    updated_at: yup.date(),
    user_id: yup.string().uuid(),
    sender_id: yup.string().uuid(),
    is_read: yup.bool(),
    is_active: yup.bool(),
    type: yup.string().strict(),
    content_id: yup.number().positive().integer()
})

export default notificationSchema