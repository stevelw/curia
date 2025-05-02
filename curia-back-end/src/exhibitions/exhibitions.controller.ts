import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from "@nestjs/common";
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
import {
  UpdateExhibitionReqDto,
  UpdateExhibitionResDto,
} from "./dto/update-exhibition.dto";

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

  @Get("/")
  @ApiOperation({ summary: "Fetch list of exhibitions" })
  @ApiResponse({
    status: 200,
    description: "Returns the exhibitions",
  })
  async getAllExhibitios(): Promise<CreateExhibitionResDto[]> {
    return await this.exhibitionsService.getAllExhibitions();
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

  @Patch("/:exhibitionId")
  @UseGuards(AuthGuard())
  @ApiOperation({ summary: "Update the exhibition" })
  @ApiResponse({
    status: 200,
    description: "Returns the updated exhibition",
  })
  @ApiResponse({
    status: 409,
    description: "Owner not signed in",
  })
  async patchExhibition(
    @GetUser() user: PrivateUser,
    @Body() updateExhibitionReqDto: UpdateExhibitionReqDto,
    @Param("exhibitionId") exhibitionId: ExhibitionId,
  ): Promise<UpdateExhibitionResDto> {
    const exhibitionToSendBack = await this.exhibitionsService.updateExhibition(
      user.username,
      exhibitionId,
      updateExhibitionReqDto,
    );
    return exhibitionToSendBack;
  }
}
