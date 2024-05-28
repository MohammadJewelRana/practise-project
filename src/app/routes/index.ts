import { Router } from 'express';
import { StudentsRoutes } from '../modules/student/student.route';
import { UserRoutes } from '../modules/user/user.route';
import { AcademicSemesterRoutes } from '../modules/academinSemester/academicSemester.route';

const router = Router();

//all route in array of object
const moduleRoutes = [
  { path: '/users', route: UserRoutes },
  { path: '/students', route: StudentsRoutes },
  { path: '/academic-semesters', route: AcademicSemesterRoutes },
];

//just looping the routes
moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
