import httpStatus from 'http-status';
import { AppError } from '../../errors/AppError';
import { User } from '../user/user.model';
import { TLoginUser } from './auth.interface';
import bcrypt from 'bcrypt';
import jwt, { JwtPayload } from 'jsonwebtoken';
import config from '../../config';

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
  console.log(isPasswordMatched);
  if (!isPasswordMatched) {
    throw new AppError(httpStatus.FORBIDDEN, '    password does not match  ');
  }

  const user = await User.findOne({ id: payload?.id }).select('+password');
  //create token and sent to client
  const jwtPayload = {
    userId: user?.id,
    role: user?.role,
  };

  const accessToken = jwt.sign(jwtPayload, config.jwt_access_secret as string, {
    expiresIn: '10d',
  });

  return {
    accessToken,
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

export const AuthService = {
  loginUserFromDB,
  changePasswordFromDB,
};
