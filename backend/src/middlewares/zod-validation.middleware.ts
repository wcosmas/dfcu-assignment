import { Request, Response, NextFunction } from 'express';
import { AnyZodObject, ZodError } from 'zod';
import { BadRequestException } from '../utils/exceptions';

/**
 * Middleware that validates request data against a Zod schema
 * @param schema Zod schema to validate against
 * @param source Where to find the data to validate (body, query, params)
 */
export const validateZod = (schema: AnyZodObject, source: 'body' | 'query' | 'params' = 'body') => {
    return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            // Get data from the appropriate request property
            const data = req[source];

            // Validate data against the schema
            const validatedData = await schema.parseAsync(data);

            // Replace the request data with the validated version
            req[source] = validatedData;

            next();
        } catch (error) {
            // Format Zod errors into a more readable format
            if (error instanceof ZodError) {
                const formattedErrors = error.errors.map(err => ({
                    field: err.path.join('.'),
                    message: err.message,
                    code: err.code
                }));

                throw new BadRequestException(JSON.stringify({
                    message: 'Validation failed',
                    errors: formattedErrors
                }));
            }

            next(error);
        }
    };
}; 