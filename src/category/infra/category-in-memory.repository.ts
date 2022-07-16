import { SearchParams, SearchResult, SortDirection } from "../../@seedwork/domain/repository/repository-contracts";
import { InMemorySearchableRepository } from "../../@seedwork/domain/repository/in-memory.repository";
import { Category } from "../../category/domain/entities/category";
import CategoryRepository from "../domain/repository/category.repository";

export default class CategoryInMemoryRepository 
  extends InMemorySearchableRepository<Category> implements CategoryRepository.RepositoryInterface {

  static DEFAULT_SORT = 'created_at';
  static DEFAULT_SORT_DIR : SortDirection = 'asc';

  sortableFields: string[] = ['name', 'created_at'];

  async search(props: SearchParams<string>): Promise<SearchResult<Category, CategoryRepository.Filter>> {
    if (!props.sort) {
      props.sort = CategoryInMemoryRepository.DEFAULT_SORT;
      props.sort_dir = CategoryInMemoryRepository.DEFAULT_SORT_DIR;
    }

    return super.search(props);
  }

  protected async applyFilter(items: Category[], filter?: CategoryRepository.Filter): Promise<Category[]> {
    if(!filter) {
      return items;
    }

    const filterLowerCase = filter.toLowerCase();
    return items.filter(i => 
      i.props.name.toLowerCase().includes(filterLowerCase)
    );
  }
} 