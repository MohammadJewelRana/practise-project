import { TAcademicFaculty } from "./academicFaculty.interface";
import { AcademicFaculty } from "./academicFaculty.model";




const createAcademicFacultyIntoDB=async(payload:TAcademicFaculty)=>{

    const result=await AcademicFaculty.create(payload);
    return result;
}

const getAllAcademicFaculty=async()=>{
    const result=await AcademicFaculty.find();
    return result;
}


const getSingleAcademicFaculty=async (academicFacultyId:string)=>{
    const result=await AcademicFaculty.findById(academicFacultyId);
    return result;
}


const updateAcademicFaculty=async (id:string,payload:Partial<TAcademicFaculty>)=>{
    const result=await AcademicFaculty.findOneAndUpdate({_id:id},payload,{new:true});
    return result;
}

export const AcademicFacultyServices={
    createAcademicFacultyIntoDB,
    getAllAcademicFaculty,
    getSingleAcademicFaculty,
    updateAcademicFaculty

}




