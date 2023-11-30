import { Controller, Get, Route } from 'tsoa'

@Route('/')
export class PingController extends Controller {
  @Get()
  public async ping(): Promise<any> {
    return {
      ping: 'pong'
    }
  }
}

@Route('/api')
export class PingController2 extends Controller {
  @Get()
  public async ping(): Promise<any> {
    return {
      apiPing: 'pong'
    }
  }
}
