import config from '../../config';
import { TAcademicSemester } from '../academinSemester/academicSemester.interface';

import { AcademicSemester } from '../academinSemester/academicSemester.model';
import { TStudent } from '../student/student.interface';
import { Student } from '../student/student.model';
import { TUser } from './user.interface';
import { User } from './user.model';
import { generateStudentId } from './user.utils';

//post
const createStudentIntoDB = async (password: string, payload: TStudent) => {
  // create a user object
  let userData: Partial<TUser> = {}; //partially use TUSer

  //if password is not given use default pass
  if (!password) {
    userData.password = config.default_pass as string;
  } else {
    userData.password = password;
  }

  //set student role
  userData.role = 'student';

  //find academic semester info and set userData id
  const admissionSemester = await AcademicSemester.findById(
    payload.admissionSemester,
  );
  if (admissionSemester) {
    userData.id = await generateStudentId(admissionSemester); //set data
  } else {
    throw new Error('Academic semester not found');
  }

  //status
  userData.status = 'in-progress';

  //create a user in user collection
  const newUser = await User.create(userData);

  //create a student in student collection
  if (Object.keys(newUser).length) {
    //set id, _id as a user
    //referencing
    payload.id = newUser.id;
    payload.user = newUser._id;

    const newStudent = await Student.create(payload);
    return newStudent;
  }
};

export const UserServices = {
  createStudentIntoDB,
};
