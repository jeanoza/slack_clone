import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

//Use loggerMiddleware like morgan for logging
@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  // for prcise context: LOG [HTTP] <LOG>
  private logger = new Logger('HTTP');

  use(request: Request, response: Response, next: NextFunction): void {
    //1
    const { ip, method, originalUrl } = request;
    const userAgent = request.get('user-agent') || '';

    //3 => exec this function after routing
    response.on('finish', () => {
      const { statusCode } = response;
      const contentLength = response.get('content-length');
      this.logger.log(
        `${method} ${originalUrl} ${statusCode} ${contentLength} - ${userAgent} ${ip}`,
      );
    });
    //2
    next();
  }
}
