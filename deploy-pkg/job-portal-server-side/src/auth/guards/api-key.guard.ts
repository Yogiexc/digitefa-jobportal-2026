import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class ApiKeyGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const apiKey = request.headers['x-api-key'];
    const expectedApiKey = process.env.LMS_INTEGRATION_API_KEY;

    if (!apiKey || apiKey !== expectedApiKey) {
      throw new UnauthorizedException('Invalid or missing API Key.');
    }
    return true;
  }
}
