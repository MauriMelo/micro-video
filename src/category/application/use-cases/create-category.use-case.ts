import CategoryRepository from "../../../category/domain/repository/category.repository";
import { Category } from "../../../category/domain/entities/category";
import { CategoryOutput } from "../dto/category-output";
import UseCase from "../../../@seedwork/application/use-case";

export type Input = {
  name: string;
  description?: string;
  is_active?: boolean;
}

export type Output = CategoryOutput;

export default class CreateCategoryUseCase implements UseCase<Input, Output> {
  constructor(
    private categoryRepo: CategoryRepository.RepositoryInterface
  ) {}

  async execute(input: Input): Promise<Output> {
    const entity = new Category(input);
    await this.categoryRepo.insert(entity);
    return {
      id: entity.id,
      name: entity.name,
      description: entity.description,
      is_active: entity.is_active,
      created_at: entity.created_at
    };
  }
}
