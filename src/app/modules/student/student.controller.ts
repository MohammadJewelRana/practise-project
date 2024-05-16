import { Request, Response } from 'express';
import { StudentsServices } from './student.service';

const createStudent = async (req: Request, res: Response) => {
  try {
    //get data
    const { student: studentData } = req.body;

    //will call service func to send this data
    // const result = await StudentsServices.createStudentIntoDB(student);
    const result = await StudentsServices.createStudentIntoDB(studentData);

    //send response
    res.status(200).json({
      success: true,
      message: 'student is created successfully',
      data: result,
    });
  } catch (error) {
    console.log(error);
  }
};

//ge students
const getAllStudents = async (req: Request, res: Response) => {
  try {
    const result = await StudentsServices.getAllStudentsFromDB();

    res.status(200).json({
      success: true,
      message: 'students retrieved successfully',
      data: result,
    });
  } catch (error) {
    console.log(error);
  }
};

const getSingleStudent = async (req: Request, res: Response) => {
  try {
    const {stuID}=req.params;
    const result = await StudentsServices.getSingleStudentsFromDB(stuID);
    res.status(200).json({
      success: true,
      message: ' specific students get   successfully',
      data: result,
    });
  } catch (error) {
    console.log(error);
  }
};

export const StudentController = {
  createStudent,
  getAllStudents,
  getSingleStudent,
};
