import { createParamDecorator, ExecutionContext } from '@nestjs/common';

//FIXME: custom decorator
//FIXME: ctx can bring http, ws, rtc context..
export const Token = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const res = ctx.switchToHttp().getResponse();
    return res.locals.jwt;
  },
);
