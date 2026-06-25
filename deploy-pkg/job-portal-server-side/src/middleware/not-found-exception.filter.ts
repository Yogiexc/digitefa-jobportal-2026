import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { Request, Response } from 'express';
import { notFoundHtml } from './404';

@Catch(HttpException)
export class NotFoundExceptionFilter implements ExceptionFilter {
    catch(exception: HttpException, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();
        const status = exception.getStatus();

        if (status === HttpStatus.NOT_FOUND) {
            const accept = request.headers.accept;

            if (accept && accept.includes('text/html')) {
                response.status(status).send(notFoundHtml);
            } else {
                // Return JSON response
                response.status(status).json({
                    statusCode: status,
                    timestamp: new Date().toISOString(),
                    path: request.url,
                    method: request.method,
                    message: 'Resource not found',
                });
            }
        } else {
            response.status(status).json(exception.getResponse());
        }
    }
}
