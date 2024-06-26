import express from 'express';
import { StudentController } from './student.controller';
import validateRequest from '../../middleware/validateRequest';
import { studentValidations } from './student.validation';
import auth from '../../middleware/auth';
import { USER_ROLE } from '../user/user.constant';

const router = express.Router();

//will call controller function
// router.post('/create-student', StudentController.createStudent);
router.get('/', StudentController.getAllStudents);
router.get('/:studentID', auth(USER_ROLE.admin,USER_ROLE.faculty),   StudentController.getSingleStudent);
router.delete('/:studentId', StudentController.deleteStudent);
router.patch('/:studentId',validateRequest(studentValidations.updateStudentValidationSchema) ,StudentController.updateStudent);

export const StudentsRoutes = router;
  