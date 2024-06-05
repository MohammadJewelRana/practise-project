import { TAcademicSemester } from '../academinSemester/academicSemester.interface';
import { User } from './user.model';

const findLastStudentId = async () => {
  const lastStudent = await User.findOne({ role: 'student' }, { id: 1 })
    .sort({ createdAt: -1 })
    .lean();

  return lastStudent?.id ? lastStudent.id : undefined;
};

//year semesterCode 4digit
export const generateStudentId = async (payload: TAcademicSemester) => {
  //firstTime 0000
  //if last student find then geneated id based on the last student..otherwise start from 1
  let currentId = (0).toString(); ////0000 default

  const lastStudentId = await findLastStudentId();
  //2030 01 0001
  const lastSemesterCode = lastStudentId?.substring(4, 6); //01
  const lastStudentYear = lastStudentId?.substring(0, 4); //2030
  const currentSemesterCode = payload.code;
  const currentYear = payload.year;

  if (
    lastStudentId &&
    lastSemesterCode === currentSemesterCode &&
    lastStudentYear === currentYear
  ) {
    currentId = lastStudentId.substring(6); //0001
  }

  let incrementId = (Number(currentId) + 1).toString().padStart(4, '0');

  incrementId = `${payload.year}${payload.code}${incrementId}`;

  return incrementId;
};

//generate faculty ID
const findFacultyID = async () => {
  const lastFaculty = await User.findOne({ role: 'faculty' }, { id: 1 })
    .sort({ createdAt: -1 })
    .lean();

  return lastFaculty?.id ? lastFaculty.id : undefined;
};

export const generateFacultyId = async () => {
  let currentId = (0).toString();
  // let currentId = '0';
  // console.log('currentID::  ', currentId);

  const lastFacultyId = await findFacultyID();
  // console.log('last faculty Id', lastStudentId);

  if (lastFacultyId) {
    currentId = lastFacultyId.substring(2);
    // console.log(typeof currentId);
  }

  let incrementId = (Number(currentId) + 1).toString().padStart(4, '0');
  // console.log(incrementId);

  incrementId = `F-${incrementId}`;
  // console.log(incrementId);

  return incrementId;
};

// Admin ID
export const findLastAdminId = async () => {
  const lastAdmin = await User.findOne({ role: 'admin' }, { id: 1, _id: 0 })
    .sort({ createdAt: -1 })
    .lean();

  return lastAdmin?.id ? lastAdmin.id.substring(2) : undefined;
};

export const generateAdminId = async () => {
  let currentId = (0).toString();
  const lastAdminId = await findLastAdminId();

  if (lastAdminId) {
    currentId = lastAdminId.substring(2);
  }

  let incrementId = (Number(currentId) + 1).toString().padStart(4, '0');

  incrementId = `A-${incrementId}`;
  return incrementId;
};
