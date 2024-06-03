import express from "express";
import { FacultyControllers } from "./faculty.controller";



const router = express.Router();

router.get('/', FacultyControllers.getAllFaculty);

// router.get('/:studentID', StudentController.getSingleStudent);
// router.delete('/:studentId', StudentController.deleteStudent);
// router.patch('/:studentId',validateRequest(studentValidations.updateStudentValidationSchema) ,StudentController.updateStudent);

export const FacultyRoutes = router;
  