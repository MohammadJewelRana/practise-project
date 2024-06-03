import { StudentsServices } from './student.service';
import sendResponse from '../../utils/sendResponse';
import httpStatus from 'http-status';
import { catchAsync } from '../../utils/catchAsync';

//get students
const getAllStudents = catchAsync(async (req, res) => {


  console.log(req.query);
  

  const result = await StudentsServices.getAllStudentsFromDB(req.query);


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

//delete student
const updateStudent = catchAsync(async (req, res) => {
  const { studentId } = req.params;
  const {student}=req.body;
  const result = await StudentsServices.updateSingleStudentsFromDB(studentId,student);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'specific students updated   successfully',
    data: result,
  });
});




export const StudentController = {
  getAllStudents,
  getSingleStudent,
  deleteStudent,
  updateStudent
};
