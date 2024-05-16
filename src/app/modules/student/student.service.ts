import { Student } from './student.interface';
import { StudentModel } from './student.model';
// import StudentModel from './student.model';

//post
const createStudentIntoDB = async (student: Student) => {
  const result = await StudentModel.create(student);
  return result;
};

//get
const getAllStudentsFromDB=async()=>{
    const result=await StudentModel.find();//student model theke find korbe
    return result;
}

//get single students
const getSingleStudentsFromDB=async(stuID:string)=>{
    const result=await StudentModel.findOne({id:stuID});
    return result;
}

export const StudentsServices={
    createStudentIntoDB,
    getAllStudentsFromDB,
    getSingleStudentsFromDB,
}