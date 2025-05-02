import { Body, Controller, Get, Param, Post, UseGuards } from "@nestjs/common";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { ExhibitionsService } from "./exhibitions.service";
import {
  CreateExhibitionReqDto,
  CreateExhibitionResDto,
} from "./dto/create-exhibition.dto";
import { GetUser } from "../auth/decorators/get-user.decorator";
import { PrivateUser } from "../users/schemas/user.schema";
import { AuthGuard } from "@nestjs/passport";
import { ExhibitionId } from "./dto/get-exhibition.dto";

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

  @Get("/:exhibitionId")
  @ApiOperation({ summary: "Fetch the exhibition" })
  @ApiResponse({
    status: 200,
    description: "Returns the exhibition",
  })
  @ApiResponse({
    status: 404,
    description: "Exhibition doesn't exist",
  })
  async getExhibition(
    @Param("exhibitionId") exhibitionId: ExhibitionId,
  ): Promise<CreateExhibitionResDto> {
    return await this.exhibitionsService.getExhibition(exhibitionId);
  }
}
