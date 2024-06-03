import httpStatus from "http-status";
import { catchAsync } from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { FacultyServices } from "./faculty.service";


const getAllFaculty=catchAsync(async (req,res)=>{
    const result=await FacultyServices.getAllFacultyFromDB();
    
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: ' All faculties data retrieved  successfully',
        data: result,
      })

    })


    export const FacultyControllers={
        getAllFaculty,
        
    }