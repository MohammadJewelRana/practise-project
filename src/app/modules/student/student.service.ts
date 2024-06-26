import mongoose from 'mongoose';
import { Student } from './student.model';
import { AppError } from '../../errors/AppError';
import httpStatus from 'http-status';
import { User } from '../user/user.model';
import { TStudent } from './student.interface';
import QueryBuilder from '../../builders/QueryBuilder';
import { studentSearchableFields } from './student.constsant';
// import StudentModel from './student.model';

//get
const getAllStudentsFromDB = async (query: Record<string, unknown>) => {
 
  //query execute from the builders
  //pass parameter model(Student.find()   and query from req.query)
  const studentQuery = new QueryBuilder(
    Student.find()
    .populate('user')
      .populate('admissionSemester')
      .populate({
        path: 'academicDepartment',
        populate: {
          path: 'academicFaculty',
        },
      }),
    query,
  )
    .search(studentSearchableFields)
    .filter()
    .sort()
    .paginate()
    .fields();
  

  //model query te sob query build hoye gese tai await kore model query k call
  const result = await studentQuery.modelQuery;
  return result;
};

 
//get single students
const getSingleStudentsFromDB = async (stuID: string) => {
  const result = await Student.findById({ _id: stuID })
    .populate('admissionSemester')
    .populate({
      path: 'academicDepartment', //academic department er vitore academic faculty referncing ache seta populate
      populate: {
        path: 'academicFaculty',
      },
    });
  return result;
};

// update single students
const updateSingleStudentsFromDB = async (
  stuID: string,
  payload: Partial<TStudent>,
) => {
  //non primitive alada
  const { name, guardian, localGuardian, ...remainingStudentData } = payload;

  //new data set
  //first kept primitive data
  const modifiedUpdatedData: Record<string, unknown> = {
    ...remainingStudentData,
  };

  //name thakle take array te convert kore for of loop chaliye value update kora dynamically
  if (name && Object.keys(name).length) {
    for (const [key, value] of Object.entries(name)) {
      modifiedUpdatedData[`name.${key}`] = value;
    }
  }

  if (guardian && Object.keys(guardian).length) {
    for (const [key, value] of Object.entries(guardian)) {
      modifiedUpdatedData[`guardian.${key}`] = value;
    }
  }

  if (localGuardian && Object.keys(localGuardian).length) {
    for (const [key, value] of Object.entries(localGuardian)) {
      modifiedUpdatedData[`localGuardian.${key}`] = value;
    }
  }

  const result = await Student.findOneAndUpdate(
    { id: stuID },
    modifiedUpdatedData,
    {
      new: true,
    },
  );

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
    throw new Error(' failed to delete student and user');
  }
};

export const StudentsServices = {
  getAllStudentsFromDB,
  getSingleStudentsFromDB,
  deleteStudentFromDB,
  updateSingleStudentsFromDB,
};
