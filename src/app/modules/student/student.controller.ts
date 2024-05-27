import { NextFunction, Request, Response } from 'express';
import { StudentsServices } from './student.service';
import sendResponse from '../../utils/sendResponse';
import httpStatus from 'http-status';

//get students
const getAllStudents = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = await StudentsServices.getAllStudentsFromDB();

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'students retrieved successfullyy',
      data: result,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

//get single students
const getSingleStudent = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { stuID } = req.params;
    const result = await StudentsServices.getSingleStudentsFromDB(stuID);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'specific students get   successfully',
      data: result,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const deleteStudent = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { studentId } = req.params;
    const result = await StudentsServices.deleteStudentFromDB(studentId);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'specific students deleted   successfully',
      data: result,
    });
  } catch (err) {
    next(err); //pass error to next function
  }
};

export const StudentController = {
  getAllStudents,
  getSingleStudent,
  deleteStudent,
};
