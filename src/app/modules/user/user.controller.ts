import httpStatus from "http-status";
import sendResponse from "../../utils/sendResponse";
import { UserServices } from "./user.service";
import { NextFunction, Request,Response } from "express";




const createStudent = async (req: Request, res: Response, next:NextFunction) => {
    try {
      //get data
      const { password,student: studentData } = req.body;

      const result = await UserServices.createStudentIntoDB(password,studentData);
  
     

      sendResponse(res,{
        statusCode:httpStatus.OK,
        success:true,
        message:'Student is created successfully',
        data:result,
      })

    } catch (error) {
      console.log(error);
      next(error)
    }
  };
  

 export  const UserControllers={
    createStudent
  }