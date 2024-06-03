import { Types } from 'mongoose';


export type TFacultyName = {
  firstName: string;
  middleName?: string;
  lastName: string;
};
export type TBloodGroup =
  | 'A+'
  | 'A-'
  | 'B+'
  | 'B-'
  | 'AB+'
  | 'AB-'
  | 'O+'
  | 'O-';

export type TGender = 'male' | 'female' | 'other';

export type TFaculty = {
  id: string;
  user: Types.ObjectId;
  name: TFacultyName;
  designation: string;
  gender: TGender;
  dateOfBirth?: string;
  email: string;
  contactNo: string;
  emergencyContactNo: string;
  bloodGroup?: TBloodGroup;
  presentAddress: string;
  permanentAddress: string;
  profileImg?: string;
  academicFaculty: Types.ObjectId;
  academicDepartment: Types.ObjectId;
  isDeleted: boolean;
};
