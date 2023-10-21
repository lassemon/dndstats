import { Controller, Get, Route } from "tsoa"

@Route("/")
export class PingController extends Controller {
  @Get()
  public async ping(): Promise<any> {
    return {
      ping: "pong",
    }
  }
}
