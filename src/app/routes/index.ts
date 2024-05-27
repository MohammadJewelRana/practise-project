import { Router } from 'express';
import { StudentsRoutes } from '../modules/student/student.route';
import { UserRoutes } from '../modules/user/user.route';

const router = Router();

//all route in array of object
const moduleRoutes = [
  { path: '/users', route: UserRoutes },
  { path: '/students', route: StudentsRoutes },
];

//just looping the routes
moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
