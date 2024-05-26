import { TStudent } from './student.interface';
import { Student } from './student.model';
// import StudentModel from './student.model';

//post
const createStudentIntoDB = async (student: TStudent) => {
  const result = await Student.create(student);
  return result;
};

//get
const getAllStudentsFromDB=async()=>{
    const result=await Student.find();//student model theke find korbe
    return result;
}

//get single students
const getSingleStudentsFromDB=async(stuID:string)=>{
    const result=await Student.findOne({_id:stuID});
    return result;
}

const deleteStudentFromDB = async (id: string) => {
    const result = await Student.updateOne({ _id:id }, { isDeleted: true });
    return result;
  };
  

export const StudentsServices={
    createStudentIntoDB,
    getAllStudentsFromDB,
    getSingleStudentsFromDB,
    deleteStudentFromDB,
}