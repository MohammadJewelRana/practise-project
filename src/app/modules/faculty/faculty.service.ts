import mongoose from 'mongoose';
import { TFaculty } from './faculty.interface';
import { Faculty } from './faculty.model';
import { AppError } from '../../errors/AppError';
import httpStatus from 'http-status';
import { User } from '../user/user.model';
import QueryBuilder from '../../builders/QueryBuilder';
import { FacultySearchableFields } from './faculty.constant';

const getAllFacultyFromDB = async (query: Record<string, unknown>) => {
  const facultyQuery = new QueryBuilder(
    Faculty.find().populate('academicDepartment'),
    query,
  )
    .search(FacultySearchableFields)
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await facultyQuery.modelQuery;

  return result;
};

const getSingleFacultyFromDB = async (facultyID: string) => {
  const result = await Faculty.findOne({ id: facultyID })
    .populate('academicDepartment')
    .populate('academicFaculty');

  return result;
};

const updateFacultyIntoDB = async (
  facultyID: string,
  payload: Partial<TFaculty>,
) => {
  const { name, ...remainingFacultyData } = payload; //destructure the all object field

  const modifiedUpdatedData: Record<string, unknown> = {
    ...remainingFacultyData,
  };

  //convert object in arrays and set value
  if (name && Object.keys(name).length) {
    for (const [key, value] of Object.entries(name)) {
      modifiedUpdatedData[`name.${key}`] = value;
    }
  }

  //when use self created id then use updateOne
  const result = await Faculty.findOneAndUpdate(
    { id:facultyID },
    { $set: modifiedUpdatedData },
    {
      new: true,
      runValidators: true,
    },
  );

  return result;
};

const deleteSingleFaculty = async (facultyID: string) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const deleteFaculty = await Faculty.updateOne(
      { id: facultyID },
      { $set: { isDeleted: true } },
      { new: true, session },
    );
    if (!deleteFaculty) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to delete faculty');
    }

    const deleteUser = await User.updateOne(
      { id: facultyID },
      { $set: { isDeleted: true } },
      { new: true, session },
    );
    if (!deleteUser) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to delete user');
    }

    await session.commitTransaction();
    await session.endSession();
    return deleteFaculty;
  } catch (error) {
    await session.abortTransaction();
    await session.endSession();
    throw new AppError(404, 'something error to delete');
  }
};

export const FacultyServices = {
  getAllFacultyFromDB,
  getSingleFacultyFromDB,
  updateFacultyIntoDB,
  deleteSingleFaculty,
};
