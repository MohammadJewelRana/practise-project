import { Student } from './student.model';
import { TStudent } from './student.interface';

// update single students
const updateSingleStudentsFromDB = async (
  stuID: string,
  payload: Partial<TStudent>,
) => {
  const result = await Student.findOne({ id: stuID });

  return result;
};
