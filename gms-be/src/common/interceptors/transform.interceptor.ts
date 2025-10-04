import {
    CallHandler,
    ExecutionContext,
    Injectable,
    NestInterceptor,
  } from '@nestjs/common';
  import { map, Observable } from 'rxjs';
  
  @Injectable()
  export class TransformInterceptor<T> implements NestInterceptor<T, any> {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
      return next.handle().pipe(
        map((data) => ({
          status: 'success',
          message: this.getMessage(context),
          data,
        })),
      );
    }
  
    private getMessage(context: ExecutionContext): string {
      const handler = context.getHandler();
      const customMessage = Reflect.getMetadata('custom:message', handler);
      return customMessage || 'Request successful';
    }
  }
  