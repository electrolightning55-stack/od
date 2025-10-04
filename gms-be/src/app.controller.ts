import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { BiometricService } from './biometric/biometric.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService,private readonly biometricService: BiometricService ) {}

  @Get()
  getHello(): string {
    this.biometricService.onModuleInit();
    return this.appService.getHello();
  }
}
