import { USER_ROLE } from "./user.constant";


export type TUser = {
  id: string;
  password: string;
  needsPasswordChange: boolean;
  passwordChangedAt?:Date;
  role: 'admin' | 'student' | 'faculty';
  status: 'in-progress' | 'blocked';
  isDeleted: boolean;
};



export type TUserRole=keyof typeof USER_ROLE;