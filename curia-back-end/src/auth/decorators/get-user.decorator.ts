import { createParamDecorator } from "@nestjs/common";
import { PrivateUser } from "src/users/schemas/user.schema";

export const GetUser = createParamDecorator((data, context): PrivateUser => {
  const req: { user: PrivateUser } = context.switchToHttp().getRequest();
  return req.user;
});
