import { Router } from 'express';
import { StudentsRoutes } from '../modules/student/student.route';
import { UserRoutes } from '../modules/user/user.route';
import { AcademicSemesterRoutes } from '../modules/academinSemester/academicSemester.route';
import { AcademicFacultyRoutes } from '../modules/academicFaculty/academicFaculty.route';
import { AcademicDepartmentRoutes } from '../modules/academicDepartment/academicDepartment.route';
import { FacultyRoutes } from '../modules/faculty/faculty.route';
import { AdminRoutes } from '../modules/admin/admin.route';
import { CourseRoutes } from '../modules/course/course.route';
import { semesterRegistrationRoutes } from '../modules/semesterRegistration/semesterRegistration.routes';
import { offeredCourseRoutes } from '../modules/offeredCourse/offeredCourse.routes';
import { AuthRoutes } from '../modules/auth/auth.route';
import { EnrolledCourseRoutes } from '../modules/enrolledCourse/enrolledCourse.route';

const router = Router();

//all route in array of object
const moduleRoutes = [
  { path: '/users', route: UserRoutes },
  { path: '/students', route: StudentsRoutes },
  { path: '/academic-semesters', route: AcademicSemesterRoutes },
  { path: '/academic-faculty', route: AcademicFacultyRoutes },
  { path: '/academic-departments', route: AcademicDepartmentRoutes },
  { path: '/faculties', route: FacultyRoutes },
  { path: '/admins', route: AdminRoutes },
  { path: '/courses', route: CourseRoutes },
  { path: '/semester-registrations', route: semesterRegistrationRoutes },
  { path: '/offered-courses', route: offeredCourseRoutes },
  { path: '/auth', route: AuthRoutes },
  { path: '/enrolled-courses', route: EnrolledCourseRoutes },
];

//just looping the routes
moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
