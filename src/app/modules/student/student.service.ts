import mongoose from 'mongoose';
import { Student } from './student.model';
import { AppError } from '../../errors/AppError';
import httpStatus from 'http-status';
import { User } from '../user/user.model';
// import StudentModel from './student.model';

//get
const getAllStudentsFromDB = async () => {
  const result = await Student.find()
    .populate('admissionSemester') //single populate
    .populate({
      path: 'academicDepartment', //academic department er vitore academic faculty referncing ache seta populate
      populate: {
        path: 'academicFaculty',
      },
    });
  return result;
};

//get single students
const getSingleStudentsFromDB = async (stuID: string) => {
  const result = await Student.findOne({ _id: stuID })
    .populate('admissionSemester')
    .populate({
      path: 'academicDepartment', //academic department er vitore academic faculty referncing ache seta populate
      populate: {
        path: 'academicFaculty',
      },
    });
  return result;
};

const deleteStudentFromDB = async (id: string) => {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    //transaction 1
    const deletedStudent = await Student.findOneAndUpdate(
      { id },
      { isDeleted: true },
      { new: true, session },
    );
    if (!deletedStudent) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to delete student');
    }

    //transaction 2
    const deletedUser = await User.findOneAndUpdate(
      { id },
      { isDeleted: true },
      { new: true, session },
    );
    if (!deletedUser) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to delete user');
    }

    await session.commitTransaction();
    await session.endSession();
    return deletedStudent;
  } catch (error) {
    // console.log(error);
    await session.abortTransaction();
    await session.endSession();
  }
};

export const StudentsServices = {
  getAllStudentsFromDB,
  getSingleStudentsFromDB,
  deleteStudentFromDB,
};
