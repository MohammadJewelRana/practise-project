import express from "express";
import { FacultyControllers } from "./faculty.controller";
import validateRequest from "../../middleware/validateRequest";
import { facultyValidation } from "./faculty.validation";



const router = express.Router();

router.get('/', FacultyControllers.getAllFaculty);
router.get('/:facultyID',FacultyControllers.getSingleFaculty);
router.delete('/:facultyID',FacultyControllers.deleteFaculty);
router.patch('/:facultyID', validateRequest(facultyValidation.updateFacultyValidationSchema) ,FacultyControllers.updateFaculty);

 
export const FacultyRoutes = router;
  