 
import { z } from 'zod';

const facultyNameSchema = z.object({
  firstName: z.string().max(20, 'First Name cannot be more than 20 characters'),
  middleName: z.string().optional(),
  lastName: z.string().max(20, 'Last Name cannot be more than 20 characters'),
});

const createFacultyValidationSchema = z.object({
  body:z.object({
    password: z.string().max(20),
    faculty:z.object({
        id: z.string(),
        user: z.string().refine((value) => /^[a-f\d]{24}$/i.test(value), {
          message: 'User ID must be a valid ObjectId',
        }),
        designation: z.string(),
        name: facultyNameSchema,
        gender: z.enum(['male', 'female', 'other']),
        dateOfBirth: z.string().optional(),
        email: z.string().email(),
        contactNo: z.string(),
        emergencyContactNo: z.string(),
        bloodGroup: z.enum(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']).optional(),
        presentAddress: z.string(),
        permanentAddress: z.string(),
        profileImg: z.string().optional(),
        academicFaculty: z.string(),
        academicDepartment: z.string(),
        isDeleted: z.boolean().default(false),
      })
    })
});

//update
const updateFacultyNameSchema = z.object({
  firstName: z.string().max(20, 'First Name cannot be more than 20 characters').optional(),
  middleName: z.string().optional(),
  lastName: z.string().max(20, 'Last Name cannot be more than 20 characters').optional(),
});

const updateFacultyValidationSchema = z.object({
  body:z.object({ 
    password: z.string().max(20).optional(),
    faculty:z.object({
        id: z.string().optional(),
        user: z.string().optional(),
        designation: z.string().optional(),
        name: updateFacultyNameSchema.optional(),
        gender: z.enum(['male', 'female', 'other']).optional(),
        dateOfBirth: z.string().optional(),
        email: z.string().email().optional(),
        contactNo: z.string().optional(),
        emergencyContactNo: z.string().optional(),
        bloodGroup: z.enum(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']).optional(),
        presentAddress: z.string().optional(),
        permanentAddress: z.string().optional(),
        profileImg: z.string().optional(),
        academicFaculty: z.string().optional(),
        academicDepartment: z.string().optional(),
        isDeleted: z.boolean().default(false).optional(),
      })
    })
});


export const facultyValidation={
    createFacultyValidationSchema,
    updateFacultyValidationSchema
}