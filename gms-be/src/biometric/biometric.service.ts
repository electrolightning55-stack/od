import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
const ZKTeco = require('zkteco');

@Injectable()
export class BiometricService {

  private readonly logger = new Logger(BiometricService.name);
  private zkInstance: any;
  private readonly deviceIp = '192.168.1.201';  
  private readonly devicePort = '4370';

  async onModuleInit() {
    const devices = [{ deviceIp: this.deviceIp, devicePort: this.devicePort }];
    this.zkInstance = new ZKTeco(devices);

    try {
      await this.zkInstance.connectAll();
      this.logger.log('Connected to ZKTeco biometric device.');
    } catch (err) {
      this.logger.error('Failed to connect to device:', err.message);
    }
  }

  async getLogs() {
    return await this.zkInstance.getAttendances(this.deviceIp);
  }

  async getUsers() {
    return await this.zkInstance.getUsers(this.deviceIp);
  }

  async getDeviceTime() {
    return await this.zkInstance.getTime(this.deviceIp);
  }

  async shutdown() {
    return await this.zkInstance.shutdown(this.deviceIp);
  }
}
