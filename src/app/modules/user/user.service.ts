import mongoose from 'mongoose';
import config from '../../config';

import { AcademicSemester } from '../academinSemester/academicSemester.model';
import { TStudent } from '../student/student.interface';
import { Student } from '../student/student.model';
import { TUser } from './user.interface';
import { User } from './user.model';
import { generateStudentId } from './user.utils';
import { AppError } from '../../errors/AppError';
import httpStatus from 'http-status';

//post
const createStudentIntoDB = async (password: string, payload: TStudent) => {
  // create a user object
  const userData: Partial<TUser> = {}; //partially use TUSer

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

  //create session
  const session = await mongoose.startSession();

  try {
    session.startTransaction(); //start the session
    if (admissionSemester) {
      userData.id = await generateStudentId(admissionSemester); //set data
    } else {
      throw new Error('Academic semester not found');
    }
    userData.status = 'in-progress';

    //create a user in user collection
    //transaction-1
    const newUser = await User.create([userData], { session }); //age silo object akhon array

    //create a student in student collection
    if (!newUser.length) {
      throw new AppError(httpStatus.BAD_REQUEST, 'failed to create user');
    }
    //set id, _id as a user
    //referencing
    payload.id = newUser[0].id;
    payload.user = newUser[0]._id;

    //create a student
    //transaction 2
    const newStudent = await Student.create([payload], { session });

    if (!newStudent.length) {
      throw new AppError(httpStatus.BAD_REQUEST, 'failed to create student');
    }

    await session.commitTransaction(); //write complete
    await session.endSession(); //end
    return newStudent;
  } catch (error) {
    console.log(error);
    await session.abortTransaction();
    await session.endSession();
  }
};

export const UserServices = {
  createStudentIntoDB,
};
