import { Body, Controller, Post, UseGuards } from "@nestjs/common";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { ExhibitionsService } from "./exhibitions.service";
import {
  CreateExhibitionReqDto,
  CreateExhibitionResDto,
} from "./dto/create-exhibition.dto";
import { GetUser } from "../auth/decorators/get-user.decorator";
import { PrivateUser } from "../users/schemas/user.schema";
import { AuthGuard } from "@nestjs/passport";

@ApiTags("Exhibitions")
@Controller("exhibitions")
export class ExhibitionsController {
  constructor(private readonly exhibitionsService: ExhibitionsService) {}

  @Post("/")
  @UseGuards(AuthGuard())
  @ApiOperation({ summary: "Create a new exhibition" })
  @ApiResponse({
    status: 201,
    description: "Returns the new exhibition",
  })
  @ApiResponse({
    status: 401,
    description: "Unauthorised",
  })
  async createExhibition(
    @Body() createExhibitionReqDto: CreateExhibitionReqDto,
    @GetUser() user: PrivateUser,
  ): Promise<CreateExhibitionResDto> {
    const { title, options } = createExhibitionReqDto;
    return await this.exhibitionsService.create(user.username, title, options);
  }
}
