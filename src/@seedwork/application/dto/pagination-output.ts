import { SearchResult } from "../../../@seedwork/domain/repository/repository-contracts";

export type PaginationOutput<Item> = {
  items: Item[];
  total: number;
  current_page: number;
  last_page: number;
  per_page: number;
}

export class PaginationOutputMapper {
  static toOutput<Item>(result: SearchResult) : PaginationOutput<Item> {
    return {
      items: result.items,
      total: result.total,
      current_page: result.current_page,
      last_page: result.last_page,
      per_page: result.per_page,
    }
  }
}