import { createParamDecorator } from "@nestjs/common";
import { User } from "src/users/schemas/user.schema";

export const GetUser = createParamDecorator((data, context): User => {
  const req: { user: User } = context.switchToHttp().getRequest();
  return req.user;
});
