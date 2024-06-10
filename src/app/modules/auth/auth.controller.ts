import httpStatus from "http-status";
import { catchAsync } from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { AuthService } from "./auth.service";


const loginUser=catchAsync(async(req,res)=>{

    const result =await AuthService.loginUserFromDB(req.body);

    sendResponse(res,{
        statusCode:httpStatus.OK,
        success:true,
        message:'User is logged in successfully',
        data:result
    })
})

const changePassword=catchAsync(async(req,res)=>{


console.log(req.user,req.body);

 
const {...passwordData}=req.body;

    const result =await AuthService.changePasswordFromDB( req.user,passwordData);

    sendResponse(res,{
        statusCode:httpStatus.OK,
        success:true,
        message:'password changed successfully',
        data:result,
    })
})


export const AuthControllers={
    loginUser,
    changePassword
}