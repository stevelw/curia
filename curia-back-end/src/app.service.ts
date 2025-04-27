import { Injectable } from "@nestjs/common";

@Injectable()
export class AppService {
  getApiLink(): string {
    return "API documentation available at /api";
  }
}
