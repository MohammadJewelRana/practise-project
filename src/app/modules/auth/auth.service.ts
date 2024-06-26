import httpStatus from 'http-status';
import { AppError } from '../../errors/AppError';
import { User } from '../user/user.model';
import { TLoginUser } from './auth.interface';
import bcrypt from 'bcrypt';

import config from '../../config';
import { createToken } from './auth.utils';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { sendEmail } from '../../utils/sendEmail';

const loginUserFromDB = async (payload: TLoginUser) => {
  //   console.log(payload);

  const isUserExists = await User.findOne({ id: payload?.id }).select(
    '+password',
  );
  //   console.log(isUserExists);

  if (!isUserExists) {
    throw new AppError(httpStatus.NOT_FOUND, 'User does not exists');
  }

  if (isUserExists?.isDeleted === true) {
    throw new AppError(httpStatus.NOT_FOUND, 'User does not exists');
  }

  if (isUserExists?.status === 'blocked') {
    throw new AppError(httpStatus.FORBIDDEN, 'User is blocked');
  }

  //check password is correct
  const isPasswordMatched = await bcrypt.compare(
    payload?.password,
    isUserExists?.password,
  );
  // console.log(isPasswordMatched);
  if (!isPasswordMatched) {
    throw new AppError(httpStatus.FORBIDDEN, '    password does not match  ');
  }

  const user = await User.findOne({ id: payload?.id }).select('+password');

  // Ensure user exists
  if (!user) {
    throw new AppError(httpStatus.FORBIDDEN, '    user not found  ');
  }

  //create token and sent to client
  const jwtPayload = {
    userId: user.id,
    role: user.role,
  };

  const accessToken = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    config.jwt_access_expires_in as string,
  );

  const refreshToken = createToken(
    jwtPayload,
    config.jwt_refresh_secret as string,
    config.jwt_refresh_expires_in as string,
  );

  return {
    accessToken,
    refreshToken,
    needsPasswordChange: user?.needsPasswordChange,
  };
};

const changePasswordFromDB = async (
  userData: JwtPayload,
  payload: { oldPassword: string; newPassword: string },
) => {
  console.log(userData);

  //validations
  const isUserExists = await User.findOne({ id: userData?.userId }).select(
    '+password',
  );
  if (!isUserExists) {
    throw new AppError(httpStatus.NOT_FOUND, 'User does not exists');
  }
  if (isUserExists?.isDeleted === true) {
    throw new AppError(httpStatus.NOT_FOUND, 'User does not exists');
  }
  if (isUserExists?.status === 'blocked') {
    throw new AppError(httpStatus.FORBIDDEN, 'User is blocked');
  }

  //check password is correct or not
  const isPasswordMatched = await bcrypt.compare(
    payload?.oldPassword,
    isUserExists?.password,
  );
  // console.log(isPasswordMatched);
  if (!isPasswordMatched) {
    throw new AppError(httpStatus.FORBIDDEN, '    password does not match  ');
  }

  //hash new password
  const newHashPassword = await bcrypt.hash(
    payload.newPassword,
    Number(config.bcrypt_salt_round),
  );

  const result = await User.findOneAndUpdate(
    //search
    {
      id: userData.userId,
      role: userData.role,
    },
    //update
    {
      password: newHashPassword,
      needsPasswordChange: false,
      passwordChangedAt: new Date(), //todays date
    },
  );
  return result;
};

const refreshToken = async (token: string) => {
  //verify token
  const decoded = jwt.verify(
    token,
    config.jwt_refresh_secret as string,
  ) as JwtPayload;

  //get data from token decoded
  const { userId, iat } = decoded;

  //validations
  const isUserExists = await User.findOne({ id: userId }).select('+password');
  if (!isUserExists) {
    throw new AppError(httpStatus.NOT_FOUND, 'User does not exists');
  }
  if (isUserExists?.isDeleted === true) {
    throw new AppError(httpStatus.NOT_FOUND, 'User does not exists');
  }
  if (isUserExists?.status === 'blocked') {
    throw new AppError(httpStatus.FORBIDDEN, 'User is blocked');
  }

  //old token expire if password change then create new token
  const isJWTIssuedBeforePasswordChanged = (
    passwordChangedTimeStamp: Date,
    jwtIssuedTimestamp: number,
  ) => {
    //convert in mili second like jwt issued timestamp
    const passwordChangedTime =
      new Date(passwordChangedTimeStamp).getTime() / 1000;
    return passwordChangedTime > jwtIssuedTimestamp;
  };
  if (
    isUserExists.passwordChangedAt &&
    isJWTIssuedBeforePasswordChanged(
      isUserExists.passwordChangedAt,
      iat as number,
    )
  ) {
    throw new AppError(httpStatus.FORBIDDEN, 'you are not authorized!!');
  }

  //create token and sent to client
  const jwtPayload = {
    userId: isUserExists.id,
    role: isUserExists.role,
  };

  const accessToken = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    config.jwt_access_expires_in as string,
  );

  return {
    accessToken,
  };
};

const forgetPassword = async (userId: string) => {
 
  const user = await User.findOne({ id: userId });
  // console.log(user);

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'This user is not found !');
  }
  // checking if the user is already deleted
  const isDeleted = user?.isDeleted;

  if (isDeleted) {
    throw new AppError(httpStatus.FORBIDDEN, 'This user is deleted !');
  }

  // checking if the user is blocked
  const userStatus = user?.status;

  if (userStatus === 'blocked') {
    throw new AppError(httpStatus.FORBIDDEN, 'This user is blocked ! !');
  }

  //create token and sent to client
  const jwtPayload = {
    userId: user.id,
    role: user.role,
  };

  const resetToken = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    '10m',
  );

  
  // const resetUILink = `http://localhost:5000?id=${user.id}&token=${resetToken} `;

  const resetUILink = `${config.reset_password_ui_link}?id=${user.id}&token=${resetToken} `;

  sendEmail(user.email, resetUILink);

  console.log( resetUILink);
};

 
const resetPassword = async (
  payload: { id: string; newPassword: string },
  token: string,
) => {

  const user = await User.findOne({ id: payload?.id });
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'This user is not found !');
  }
  const isDeleted = user?.isDeleted;
  if (isDeleted) {
    throw new AppError(httpStatus.FORBIDDEN, 'This user is deleted !');
  }
  const userStatus = user?.status;
  if (userStatus === 'blocked') {
    throw new AppError(httpStatus.FORBIDDEN, 'This user is blocked ! !');
  }

//verify token
  const decoded = jwt.verify(
    token,
    config.jwt_access_secret as string,
  ) as JwtPayload;


  //check token useriD and body id same or not
  if (payload.id !== decoded.userId) {
    console.log(payload.id, decoded.userId);
    throw new AppError(httpStatus.FORBIDDEN, 'You are forbidden!');
  }

  //hash new password
  const newHashedPassword = await bcrypt.hash(
    payload.newPassword,
    Number(config.bcrypt_salt_round),
  );

  //update password
  await User.findOneAndUpdate(
    {
      id: decoded.userId,
      role: decoded.role,
    },
    {
      password: newHashedPassword,
      needsPasswordChange: false,
      passwordChangedAt: new Date(),
    },
  );
};

export const AuthService = {
  loginUserFromDB,
  changePasswordFromDB,
  refreshToken,
  forgetPassword,
  resetPassword,
};
