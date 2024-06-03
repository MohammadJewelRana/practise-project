import { Faculty } from "./faculty.model"




const getAllFacultyFromDB=async()=>{
    const result=await Faculty.find().populate('academicDepartment').populate('academicFaculty');
    return result;
}



export const FacultyServices={
    getAllFacultyFromDB,

}
