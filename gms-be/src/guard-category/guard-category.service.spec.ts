import { Test, TestingModule } from '@nestjs/testing';
import { GuardCategoryService } from './guard-category.service';

describe('EmployeeCategoryService', () => {
  let service: GuardCategoryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GuardCategoryService],
    }).compile();

    service = module.get<GuardCategoryService>(GuardCategoryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
