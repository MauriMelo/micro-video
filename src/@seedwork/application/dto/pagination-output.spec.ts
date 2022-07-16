import { SearchResult } from "../../domain/repository/repository-contracts"
import { PaginationOutputMapper } from "./pagination-output";

describe('PaginationOutput Unit Tests', () => {
  it('should convert search result to pagination', () => {
    const searchResult = new SearchResult({
      current_page: 1,
      items: [],
      per_page: 1,
      total: 10,
      filter: null,
      sort: 'name',
      sort_dir: 'asc'
    });

    const paginationOutput = PaginationOutputMapper.toOutput(searchResult);
    expect(paginationOutput).toStrictEqual({
      items: [],
      total: 10,
      current_page: 1,
      last_page: 10,
      per_page: 1,
    });
  })
})