import { Router } from 'express';
import { StudentsRoutes } from '../modules/student/student.route';
import { UserRoutes } from '../modules/user/user.route';
import { AcademicSemesterRoutes } from '../modules/academinSemester/academicSemester.route';
import { AcademicFacultyRoutes } from '../modules/academicFaculty/academicFaculty.route';
import { AcademicDepartmentRoutes } from '../modules/academicDepartment/academicDepartment.route';
import { FacultyRoutes } from '../modules/faculty/faculty.route';

const router = Router();

//all route in array of object
const moduleRoutes = [
  { path: '/users', route: UserRoutes },
  { path: '/students', route: StudentsRoutes },
  { path: '/academic-semesters', route: AcademicSemesterRoutes },
  { path: '/academic-faculty', route: AcademicFacultyRoutes },
  { path: '/academic-departments', route: AcademicDepartmentRoutes },
  { path: '/faculties', route: FacultyRoutes },
];

//just looping the routes
moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
