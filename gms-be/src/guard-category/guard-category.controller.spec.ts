import { Test, TestingModule } from '@nestjs/testing';
import { GuardCategoryController } from './guard-category.controller';

describe('EmployeeCategoryController', () => {
  let controller: GuardCategoryController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GuardCategoryController],
    }).compile();

    controller = module.get<GuardCategoryController>(GuardCategoryController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
