import { 
  SearchableRepositoryInterface,
  SearchParams as DefaultSearchParams,
  SearchResult as DefaultSearchResult 
} from "../../../@seedwork/domain/repository/repository-contracts";
import { Category } from "../entities/category";

namespace CategoryRepository {
  export type Filter = string;
  export class SearchParams extends DefaultSearchParams<Filter> { }
  export class SearchResult extends DefaultSearchResult<Category, Filter> {}
  export interface RepositoryInterface 
    extends SearchableRepositoryInterface<
      Category,
      Filter,
      SearchParams,
      SearchResult
    > { }
} 

export default CategoryRepository;
