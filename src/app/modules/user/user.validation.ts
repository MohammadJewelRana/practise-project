import { z } from 'zod';
import { UserStatus } from './user.constant';

const userValidationSchema = z.object({
  // id:z.string(),
  password: z
    .string({
      invalid_type_error: 'Password must me string',
    })
    .max(20, { message: 'Password can not be more than 20 characters' })
    .optional(),
  // needsPasswordChange:z.boolean().optional().default(true),
  // role:z.enum(['student','faculty','admin']),
  status: z
    .enum(['in-progress', 'blocked'])
    .default('in-progress')
    .default('in-progress'),
  // isDeleted:z.boolean().optional().default(false),
});

const changeStatusValidationSchema = z.object({
  body: z.object({
    status: z.enum([...UserStatus] as [string, ...string[]]),
  }),
});

export const UserValidation = {
  userValidationSchema,
  changeStatusValidationSchema,
};
