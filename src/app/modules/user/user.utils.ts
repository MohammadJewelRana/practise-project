import { TAcademicSemester } from "../academinSemester/academicSemester.interface";
import { User } from "./user.model";


const findLastStudentId=async()=>{
    const lastStudent=await User.findOne({role:'student'},{id:1}).sort({createdAt:-1}).lean();

    return lastStudent?.id  ? lastStudent.id.substring(6) : undefined;
}

//year semesterCode 4digit
export const generateStudentId = async( payload:TAcademicSemester) => {
  //firstTime 0000
  //if last student find then geneated id based on the last student..otherwise start from 1
  const currentId =await findLastStudentId() ||(0).toString();

  let incrementId= (Number(currentId)+1).toString().padStart(4,'0');

  incrementId=`${payload.year}${payload.code}${incrementId}`;

  return incrementId;

};
