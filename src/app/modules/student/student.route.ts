import express from 'express';
import { StudentController } from './student.controller';
import validateRequest from '../../middleware/validateRequest';
import { studentValidations } from './student.validation';

const router = express.Router();

//will call controller function
// router.post('/create-student', StudentController.createStudent);
router.get('/', StudentController.getAllStudents);
router.get('/:studentID', StudentController.getSingleStudent);
router.delete('/:studentId', StudentController.deleteStudent);
router.patch('/:studentId',validateRequest(studentValidations.updateStudentValidationSchema) ,StudentController.updateStudent);

export const StudentsRoutes = router;
  