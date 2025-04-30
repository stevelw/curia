import { Body, Controller, Patch, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { UsersService } from "./users.service";
import {
  UpdateFavouritesReqDto,
  UpdateFavouritesResDto,
} from "./dto/update-favourites.dto";
import { GetUser } from "../auth/decorators/get-user.decorator";
import { PrivateUser } from "./schemas/user.schema";

@ApiTags("Users")
@Controller("users")
@UseGuards(AuthGuard())
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Patch("/favourites")
  @ApiOperation({ summary: "Update the logged in user's favourites" })
  @ApiResponse({
    status: 200,
    description: "Returns teh updated list of favourites",
  })
  @ApiResponse({
    status: 409,
    description: "User not signed in",
  })
  async patchFavourites(
    @Body() updateFavouritesReqDto: UpdateFavouritesReqDto,
    @GetUser() user: PrivateUser,
  ): Promise<UpdateFavouritesResDto> {
    const favouritesToSendBack = await this.usersService.updateFavourites(
      updateFavouritesReqDto,
      user.username,
    );
    return favouritesToSendBack;
  }
}
