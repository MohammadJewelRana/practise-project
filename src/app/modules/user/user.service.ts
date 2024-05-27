import config from '../../config';
import { TStudent } from '../student/student.interface';
import { Student } from '../student/student.model';
import { TUser } from './user.interface';
import { User } from './user.model';

//post
const createStudentIntoDB = async (password: string, studentData: TStudent) => {
  // create a user object
  let userData: Partial<TUser> = {};//partially use TUSer

  //if password is not given use default pass
  if (!password) {
    userData.password = config.default_pass as string;
  } else {
    userData.password = password;
  }

  //set student role
  userData.role = 'student';

  //manually generated id
  userData.id = '20300000254324';

  //status
  userData.status='in-progress';

  //create a user in user collection
  const newUser = await User.create(userData);

  //create a student in student collection
  if (Object.keys(newUser).length) {
    //set id, _id as a user
    //referencing
    studentData.id = newUser.id;
    studentData.user = newUser._id;

    const newStudent = await Student.create(studentData);
    return newStudent;
  }
};

export const UserServices = {
  createStudentIntoDB,
};
