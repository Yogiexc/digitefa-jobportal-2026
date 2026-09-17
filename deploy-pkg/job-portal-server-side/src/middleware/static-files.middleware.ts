import { Injectable, NestMiddleware, NotFoundException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { existsSync } from 'fs';
import { join } from 'path';

@Injectable()
export class StaticFilesMiddleware implements NestMiddleware {
    use(req: Request, res: Response, next: NextFunction) {
        const filePath = join(__dirname, '..', '..', '..', 'public', req.path);
        if (existsSync(filePath)) {
            // File exists, continue to the next middleware
            next();
        } else {
            // File does not exist, throw a NotFoundException
            next(new NotFoundException('Resource not found'));
        }
    }
}
