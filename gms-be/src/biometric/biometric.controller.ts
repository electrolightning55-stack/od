import { Controller, Get, Post } from '@nestjs/common';
import { BiometricService } from './biometric.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags("Biometric")
@Controller('biometric')
export class BiometricController {

  constructor(private readonly biometric: BiometricService) {}

  @Get('logs')
  getLogs() {
    return this.biometric.getLogs();
  }

  @Get('users')
  getUsers() {
    return this.biometric.getUsers();
  }

  @Get('time')
  getDeviceTime() {
    return this.biometric.getDeviceTime();
  }

  @Post('shutdown')
  shutdown() {
    return this.biometric.shutdown();
  }
}
