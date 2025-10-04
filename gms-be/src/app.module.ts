import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { RoleModule } from './role/role.module';
import { UserRoleModule } from './user-role/user-role.module';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { GuardCategoryModule } from './guard-category/guard-category.module';
import { OrganizationModule } from './organization/organization.module';
import { GuardService } from './guard/guard.service';
import { GuardModule } from './guard/guard.module';
import { EmployeeModule } from './employee/employee.module';
import { ClientModule } from './client/client.module';
import { LocationModule } from './location/location.module';
import { ShiftModule } from './shift/shift.module';
import { FileModule } from './file/file.module';
import { FileService } from './file/file.service';
import { LocationTypeModule } from './location-type/location-type.module';
import { AttendanceModule } from './attendance/attendance.module';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { BiometricService } from './biometric/biometric.service';
import { BiometricModule } from './biometric/biometric.module';
import { PayrollModule } from './payroll/payroll.module';
import { AccountsService } from './accounts/accounts.service';
import { AccountsController } from './accounts/accounts.controller';
import { AccountsModule } from './accounts/accounts.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal:true,
    }),
    ThrottlerModule.forRoot([
      // {
      //   name: 'short',
      //   ttl: 1000,
      //   limit: 3,
      // },
      // {
      //   name: 'medium',
      //   ttl: 10000,
      //   limit: 20
      // },
      {
        name: 'long',
        ttl: 60000,
        limit: 500
      }
    ]),
    AuthModule, UserModule, RoleModule, UserRoleModule, PrismaModule, GuardCategoryModule, OrganizationModule, GuardModule, EmployeeModule, ClientModule, LocationModule, ShiftModule, FileModule, LocationTypeModule, AttendanceModule, PayrollModule, BiometricModule, AccountsModule,  
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard, 
    },
    AppService, FileService,GuardService, BiometricService, AccountsService
  ],
})
export class AppModule {}
  