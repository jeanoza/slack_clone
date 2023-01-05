import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable, map } from 'rxjs';

//FIXME: interceptor make to customize response data
//ex: user => {data:user, code:'SUCCESS'}
//ex: data => data === undefined ? null : data // for json who cannot understand undefined
// router 1: A-B-C-D
// router 2: A-Z-W-D
@Injectable()
export class UndefinedToNullInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    //before send(A)

    //at the last momment(D)
    return next
      .handle()
      .pipe(map((data) => (data === undefined ? null : data)));
  }
}
