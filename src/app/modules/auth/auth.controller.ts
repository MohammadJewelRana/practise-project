import httpStatus from 'http-status';
import { catchAsync } from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { AuthService } from './auth.service';
import config from '../../config';

const loginUser = catchAsync(async (req, res) => {
  const result = await AuthService.loginUserFromDB(req.body);

  const {refreshToken,accessToken,needsPasswordChange}=result;

  res.cookie('refreshToken',refreshToken,{
    secure:config.NODE_ENV==='production',
    httpOnly:true
  })

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User is logged in successfully',
    data: {accessToken,needsPasswordChange},
  });
});

const changePassword = catchAsync(async (req, res) => {
  console.log(req.user, req.body);

  const { ...passwordData } = req.body;

  const result = await AuthService.changePasswordFromDB(req.user, passwordData);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'password changed successfully',
    data: result,
  });
});


const refreshToken=catchAsync(async(req,res)=>{

    const {refreshToken}=req.cookies;
    console.log(refreshToken);
    


    const result = await AuthService.refreshToken(refreshToken);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'access token retrieved successfully',
      data:result,
    });

})


export const AuthControllers = {
  loginUser,
  changePassword,
  refreshToken
};
