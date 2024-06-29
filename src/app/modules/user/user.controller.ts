import httpStatus from 'http-status';
import sendResponse from '../../utils/sendResponse';
import { UserServices } from './user.service';
import { catchAsync } from '../../utils/catchAsync';

const createStudent = catchAsync(async (req, res) => {

// console.log(req.file);//get file
// // console.log(req.body.data);//get json data in text format
// console.log( JSON.parse(req.body.data));//convert text data in json format


  const { password, student: studentData } = req.body;
  const result = await UserServices.createStudentIntoDB(password, studentData,req.file);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Student is created successfully',
    data: result,
 
  });
});


const createFaculty=catchAsync(async(req,res)=>{
  const {password,faculty:facultyData}=req.body;
  const result=await UserServices.createFacultyIntoDB(password,facultyData);
  sendResponse(res,{
    statusCode:httpStatus.OK,
    success:true,
    message:'Faculty is created successfully',
    data:result
  })
})


const createAdmin = catchAsync(async (req, res) => {
  const { password, admin: adminData } = req.body;

  const result = await UserServices.createAdminIntoDB(password, adminData);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Admin is created successfully',
    data: result,
  });
});


const getMe = catchAsync(async (req, res) => {
  
  const { userId, role } = req.user;
  const result = await UserServices.getMe(userId, role);

  

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'get user data successfully',
    data: result,
  });
});


const changeStatus = catchAsync(async (req, res) => {
  const id = req.params.id;

  const result = await UserServices.changeStatus(id, req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Status is updated successfully',
    data: result,
  });
});

export const UserControllers = {
  createStudent,
  createFaculty,
  createAdmin,
  getMe,
  changeStatus,

};



