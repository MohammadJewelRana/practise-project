import httpStatus from 'http-status';
import sendResponse from '../../utils/sendResponse';

import { catchAsync } from '../../utils/catchAsync';
import { AcademicSemesterServices } from './academicSemester.service';

const createAcademicSemester = catchAsync(async (req, res) => {
  //get data
  const result = await AcademicSemesterServices.createAcademicSemesterIntoDB(
    req.body,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Academic semester is created successfully',
    data: result,
  });
});

//get all
const getAllAcademicSemester=catchAsync(async(req,res)=>{
  const result=await AcademicSemesterServices.getAllAcademicSemesterFromDB();
  sendResponse(res,{
    statusCode:httpStatus.OK,
    success:true,
    message:'Get all academic semester successfully',
    data:result
  })
})

//get single
const getSingleAcademicSemester= catchAsync(async(req,res)=>{

  const {academicSemesterId}=req.params;
  const result=await AcademicSemesterServices.getSingleAcademicSemesterFromDB(academicSemesterId);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: ' Single Academic semester is retrieved successfully',
    data: result,
  });
})

//update
const updateSingleAcademicSemester=catchAsync(async(req,res)=>{
  const {academicSemesterId}=req.params;
  const bodyData=req.body;
  const result=await AcademicSemesterServices.updateSingleAcademicSemesterFromDB(academicSemesterId,bodyData);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: ' Single Academic semester is  updated successfully',
    data: result,
  });
  
})

 




export const AcademicSemesterControllers = {
  createAcademicSemester,
  getAllAcademicSemester,
  getSingleAcademicSemester,
  updateSingleAcademicSemester,
};
