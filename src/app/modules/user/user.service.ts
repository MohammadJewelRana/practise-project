/* eslint-disable @typescript-eslint/no-explicit-any */
import { TFaculty } from './../faculty/faculty.interface';
import mongoose from 'mongoose';
import config from '../../config';

import { AcademicSemester } from '../academinSemester/academicSemester.model';
import { TStudent } from '../student/student.interface';
import { Student } from '../student/student.model';
import { TUser } from './user.interface';
import { User } from './user.model';
import { generateAdminId, generateFacultyId, generateStudentId } from './user.utils';
import { AppError } from '../../errors/AppError';
import httpStatus from 'http-status';
import { Faculty } from '../faculty/faculty.model';
import { AcademicDepartment } from '../academicDepartment/academicDepartment.model';
import { AcademicFaculty } from '../academicFaculty/academicFaculty.model';
import { Admin } from '../admin/admin.model';
import { TAdmin } from '../admin/admin.interface';

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
  userData.email=payload.email;

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
  } catch (error: any) {
    // console.log(error);
    await session.abortTransaction();
    await session.endSession();
    throw new Error(error);
  }
};

//create faculty
const createFacultyIntoDB = async (password: string, payload: TFaculty) => {
  const userData: Partial<TUser> = {}; //partially use TUSer

  if (!password) {
    userData.password = config.default_pass as string;
  } else {
    userData.password = password;
  }

  //set faculty role
  userData.role = 'faculty';
  userData.status = 'in-progress';
  userData.email=payload.email;

  const academicDepartment = await AcademicDepartment.findById(
    payload.academicDepartment,
  );
  if (!academicDepartment) {
    throw new AppError(400, 'academic department not found');
  }

  const academicFaculty = await AcademicFaculty.findById(
    payload.academicFaculty,
  );
  if (!academicFaculty) {
    throw new AppError(400, 'academic faculty not found');
  }

  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    userData.id = await generateFacultyId();

    //transaction 1
    const newUser = await User.create([userData], { session });
    if (!newUser.length) {
      throw new AppError(httpStatus.BAD_REQUEST, 'failed to create new user');
    }

    payload.id = newUser[0].id;//generated faculty id
    payload.user = newUser[0]._id;//referencing user _id to faculty user field

    //transaction 2
    const newFaculty = await Faculty.create([payload], { session });
    if (!newFaculty.length) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        'failed to create new faculty',
      );
    }

    await session.commitTransaction(); //write complete
    await session.endSession(); //end
    return newFaculty;
  } catch (error: any) {
    await session.abortTransaction();
    await session.endSession();
    throw new Error(error);
  }
};

const createAdminIntoDB = async (password: string, payload: TAdmin) => {
  // create a user object
  const userData: Partial<TUser> = {};

  //if password is not given , use deafult password
  userData.password = password || (config.default_pass as string);

  //set student role
  userData.role = 'admin';
  userData.email=payload.email;

  const session = await mongoose.startSession();

  try {
    session.startTransaction();
    //set  generated id
    userData.id = await generateAdminId();

    // create a user (transaction-1)
    const newUser = await User.create([userData], { session }); 

    //create a admin
    if (!newUser.length) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create admin');
    }
    // set id , _id as user
    payload.id = newUser[0].id;
    payload.user = newUser[0]._id; //reference _id

    // create a admin (transaction-2)
    const newAdmin = await Admin.create([payload], { session });

    if (!newAdmin.length) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create admin');
    }

    await session.commitTransaction();
    await session.endSession();

    return newAdmin;
  } catch (err: any) {
    await session.abortTransaction();
    await session.endSession();
    throw new Error(err);
  }
};
 


export const UserServices = {
  createStudentIntoDB,
  createFacultyIntoDB,
  createAdminIntoDB
};
