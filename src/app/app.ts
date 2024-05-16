import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import { StudentsRoutes } from './modules/student/student.route';

const app: Application = express();

//parser
app.use(express.json());
app.use(cors());
app.use(express.text());

//application routes
app.use('/api/v1/students',StudentsRoutes)//go which routes identify 



app.get('/', (req: Request, res: Response) => {
  const a = 10;
  res.json({
    message:'hello world jewel'
  });
});

export default app;
