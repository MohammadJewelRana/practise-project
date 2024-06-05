import httpStatus from 'http-status';
import { catchAsync } from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { FacultyServices } from './faculty.service';

const getAllFaculty = catchAsync(async (req, res) => {
  const result = await FacultyServices.getAllFacultyFromDB(req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: ' All faculties data retrieved  successfully',
    data: result,
  });
});


const getSingleFaculty = catchAsync(async (req, res) => {
  const { facultyID } = req.params;
  const result = await FacultyServices.getSingleFacultyFromDB( facultyID );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: ' single Faculty is retrieved succesfully',
    data: result,
  });
});

const updateFaculty = catchAsync(async (req, res) => {
  const { facultyID } = req.params;
  const { faculty } = req.body;
  const result = await FacultyServices.updateFacultyIntoDB( facultyID , faculty);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Faculty is updated successfully',
    data: result,
  });
});


const deleteFaculty = catchAsync(async (req, res) => {
  const { facultyID } = req.params;
  
  const result = await FacultyServices.deleteSingleFaculty( facultyID );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Faculty is deleted successfully',
    data: result,
  });
});



export const FacultyControllers = {
  getAllFaculty,
  getSingleFaculty,
  updateFaculty,
  deleteFaculty

};
