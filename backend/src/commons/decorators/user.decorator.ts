import { createParamDecorator, ExecutionContext } from '@nestjs/common';

//FIXME: custom decorator
export const User = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
