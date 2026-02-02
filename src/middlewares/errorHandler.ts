import { Request, Response } from 'express';

export const errorHandler = (
    error: Error,
    req: Request,
    res: Response
): void => {
    console.error('Error:', error);

    // Handle known errors
    if (error.message === 'User with this email already exists') {
        res.status(409).json({
            success: false,
            message: error.message,
        });
        return;
    }

    res.status(500).json({
        success: false,
        message: 'Internal server error',
    });
};