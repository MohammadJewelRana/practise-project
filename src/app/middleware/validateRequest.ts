import { AnyZodObject } from 'zod';
import { NextFunction, Request, Response } from 'express';
import { catchAsync } from '../utils/catchAsync';

const validateRequest = (schema: AnyZodObject) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    // console.log(req.body);
    //validation
    await schema.parseAsync({
      body: req.body,
      cookies: req.cookies,
    });
    next(); //go to next middleware
  });
};

export default validateRequest;
