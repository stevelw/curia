import { createParamDecorator } from "@nestjs/common";

export const GetUser = createParamDecorator((data, context): string => {
  const req: { username: string } = context.switchToHttp().getRequest();
  return req.username;
});
