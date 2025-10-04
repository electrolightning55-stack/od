import { Module } from '@nestjs/common';
import { GuardCategoryService  } from './guard-category.service';
import { GuardCategoryController } from './guard-category.controller';

@Module({
  providers: [GuardCategoryService],
  controllers: [GuardCategoryController]
})
export class GuardCategoryModule {}
