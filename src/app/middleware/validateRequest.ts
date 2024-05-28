import { AnyZodObject } from 'zod';
import { NextFunction, Request, Response } from 'express';

const validateRequest = (schema: AnyZodObject) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    // console.log(req.body);

    try {
      //validation
      await schema.parseAsync({
        body: req.body,
      });
      return next(); //go to next middleware
    } catch (error) {
      next(error); //go to global error handler
    }
  };
};

export default validateRequest;
