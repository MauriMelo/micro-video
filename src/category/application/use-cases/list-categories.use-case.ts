import CategoryRepository from "../../domain/repository/category.repository";
import { CategoryOutput, CategoryOutputMapper } from "../dto/category-output";
import UseCase from "../../../@seedwork/application/use-case";
import { SearchInputDto } from "../../../@seedwork/application/dto/search-input";
import { PaginationOutput, PaginationOutputMapper } from "../../../@seedwork/application/dto/pagination-output";
import { SearchResult } from "../../../@seedwork/domain/repository/repository-contracts";
import { Category } from "../../../category/domain/entities/category";

export type Input = SearchInputDto<string>;

export type Output = PaginationOutput<CategoryOutput>

export default class ListCategoriesUseCase implements UseCase<Input, Output> {
  constructor(
    private categoryRepo: CategoryRepository.RepositoryInterface
  ) {}

  async execute(input?: Input): Promise<Output> {
    const searchResult = await this.categoryRepo.search(new CategoryRepository.SearchParams(input));
    return this.toOutput(searchResult);
  }

  toOutput(searchResult: SearchResult) {
    const items = searchResult.items.map(i => CategoryOutputMapper.toOutput(i));
    const pagination = PaginationOutputMapper.toOutput<Category>(searchResult);
    return {
      items,
      total: pagination.total,
      current_page: pagination.current_page,
      last_page: pagination.last_page,
      per_page: pagination.per_page
    }
  }
}
