import express, { Application, Request, Response } from 'express';
import cors from 'cors';

import globalErrorHandler from './middleware/globalErrorHandler';
import notFound from './middleware/notFound';
import router from './routes';
import cookieParser from 'cookie-parser';

const app: Application = express();

//parser
app.use(express.json());
app.use(cors());
app.use(express.text());
app.use(cookieParser());

//application routes
// app.use('/api/v1/students',StudentsRoutes)//go which routes identify
// app.use('/api/v1/users',UserRoutes)//go which routes identify

app.use('/api/v1', router); //get routes from router folder

app.get('/', (req: Request, res: Response) => {
  res.json({
    message: 'hello world jewel',
  });
});

//global error handling
app.use(globalErrorHandler); //error handling
app.use(notFound); //not found route

export default app;
