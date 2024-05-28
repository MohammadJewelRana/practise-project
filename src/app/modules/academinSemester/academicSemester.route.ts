import express from 'express';
import { AcademicSemesterControllers } from './academicSemester.controller';
import validateRequest from '../../middleware/validateRequest';
import { AcademicSemesterValidation } from './academicSemester.validation';
 


const router = express.Router();

router.post('/create-academic-semester',validateRequest(AcademicSemesterValidation.createAcademicSemesterValidationSchema) ,AcademicSemesterControllers.createAcademicSemester);

router.get('/',AcademicSemesterControllers.getAllAcademicSemester);
router.get('/:academicSemesterId',AcademicSemesterControllers.getSingleAcademicSemester);

router.patch('/:academicSemesterId',validateRequest(AcademicSemesterValidation.updateAcademicSemesterValidationSchema),AcademicSemesterControllers.updateSingleAcademicSemester);



export const AcademicSemesterRoutes = router;
