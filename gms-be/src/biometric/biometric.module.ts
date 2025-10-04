import { Module } from '@nestjs/common';
import { BiometricService } from './biometric.service';
import { BiometricController } from './biometric.controller';

@Module({
    providers: [BiometricService],
    controllers: [BiometricController]
})
export class BiometricModule {}
