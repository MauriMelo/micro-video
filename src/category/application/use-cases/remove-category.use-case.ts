import UseCase from "../../../@seedwork/application/use-case";
import CategoryRepository from "../../../category/domain/repository/category.repository";

export type Input = {
  id: string;
};

export type Output = boolean;

export default class RemoveCategoryUseCase implements UseCase<Input, Output> {
  constructor(
    private categoryRepo: CategoryRepository.RepositoryInterface
  ) {}

  async execute(input: Input): Promise<Output> {
    await this.categoryRepo.delete(input.id);
    return true;
  }
}
