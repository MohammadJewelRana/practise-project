import express from 'express';
import { UserControllers } from './user.controller';

import { createStudentValidationSchema } from '../student/student.validation';
import validateRequest from '../../middleware/validateRequest';
import { facultyValidation } from '../faculty/faculty.validation';
import { AdminValidations } from '../admin/admin.validation';
import auth from '../../middleware/auth';
import { USER_ROLE } from './user.constant';
import { UserValidation } from './user.validation';

const router = express.Router();

router.post(
  '/create-student',
  auth(USER_ROLE.admin),
  validateRequest(createStudentValidationSchema),
  UserControllers.createStudent,
);

router.post(
  '/create-faculty',
  auth(USER_ROLE.admin),
  validateRequest(facultyValidation.createFacultyValidationSchema),
  UserControllers.createFaculty,
);

router.post(
  '/create-admin',
  // auth(USER_ROLE.admin),
  validateRequest(AdminValidations.createAdminValidationSchema),
  UserControllers.createAdmin,
);


router.get(
  '/me',
  auth(USER_ROLE.admin,USER_ROLE.student,USER_ROLE.faculty),
  UserControllers.getMe,
);

router.post(
  '/change-status/:id',
  // auth(USER_ROLE.superAdmin, USER_ROLE.admin),
  validateRequest(UserValidation.changeStatusValidationSchema),
  UserControllers.changeStatus,
);


export const UserRoutes = router;
