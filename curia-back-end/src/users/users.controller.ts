import { Body, Controller, Get, Patch, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { UsersService } from "./users.service";
import {
  UpdateFavouritesReqDto,
  UpdateFavouritesResDto,
} from "./dto/update-favourites.dto";
import { GetUser } from "../auth/decorators/get-user.decorator";
import { PrivateUser } from "./schemas/user.schema";
import { FavouritesResDto } from "./dto/favourites.dto";

@ApiTags("Users")
@Controller("users")
@UseGuards(AuthGuard())
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get("/favourites")
  @ApiOperation({ summary: "Fetch the logged in user's favourites" })
  @ApiResponse({
    status: 200,
    description: "Returns the list of favourites",
  })
  @ApiResponse({
    status: 409,
    description: "User not signed in",
  })
  async getFavourites(@GetUser() user: PrivateUser): Promise<FavouritesResDto> {
    const localUser = await this.usersService.fetch(user.username);
    return { favourites: localUser.favourites };
  }

  @Patch("/favourites")
  @ApiOperation({ summary: "Update the logged in user's favourites" })
  @ApiResponse({
    status: 200,
    description: "Returns the updated list of favourites",
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
