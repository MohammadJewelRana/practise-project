import { StudentsServices } from './student.service';
import sendResponse from '../../utils/sendResponse';
import httpStatus from 'http-status';
import { catchAsync } from '../../utils/catchAsync';

//get students
const getAllStudents = catchAsync(async (req, res) => {
  const result = await StudentsServices.getAllStudentsFromDB();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'students retrieved successfully',
    data: result,
  });
});

//get single students
const getSingleStudent = catchAsync(async (req, res) => {
  const { studentID } = req.params;
  const result = await StudentsServices.getSingleStudentsFromDB(studentID);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'specific students get   successfully',
    data: result,
  });
});

//delete student
const deleteStudent = catchAsync(async (req, res) => {
  const { studentId } = req.params;
  const result = await StudentsServices.deleteStudentFromDB(studentId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'specific students deleted   successfully',
    data: result,
  });
});

export const StudentController = {
  getAllStudents,
  getSingleStudent,
  deleteStudent,
};
