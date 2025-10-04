import { Module } from '@nestjs/common';
import { EmployeeService } from './employee.service';
import { EmployeeController } from './employee.controller';
import { UserService } from 'src/user/user.service';
import { Roles } from 'src/common/decorators/role.decorator';
import { RoleService } from 'src/role/role.service';

@Module({
  providers: [EmployeeService , UserService, RoleService],
  controllers: [EmployeeController]
})
export class EmployeeModule {}
