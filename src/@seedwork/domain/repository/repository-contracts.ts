import Entity from "../entity/entity";
import UniqueEntityId from "../value-objects/unique-entity-id.vo";

export interface RepositoryInterface<E extends Entity> {
  insert(entity: E): Promise<void>;
  findById(id: string | UniqueEntityId): Promise<E>;
  findAll(): Promise<E[]>;
  update(entity: E): Promise<void>;
  delete(id: string | UniqueEntityId): Promise<void>;
}

export type SortDirection = 'asc' | 'desc'

interface SearchProps<Filter = string> {
  page?: number;
  per_page?:number;
  sort?: string;
  sort_dir?: SortDirection;
  filter?: Filter;
}

export class SearchParams<Filter = string> {
  private static PER_PAGE = 15;
  _page?: number;
  _per_page?: number = SearchParams.PER_PAGE;
  _sort?: string | null;
  _sort_dir?: SortDirection | null;
  _filter: Filter | null;

  constructor(props: SearchProps<Filter> = {}) {
    this.page = props.page;
    this.per_page = props.per_page;
    this.sort = props.sort;
    this.sort_dir = props.sort_dir;
    this.filter = props.filter;
  }

  get page() {
    return this._page;
  }

  private set page(value: number) {
    let _page = parseInt(value as any);
    if (Number.isNaN(_page) || _page <= 0) {
      _page = 1;
    }

    this._page = _page;
  }

  get per_page() {
    return this._per_page;
  }

  private set per_page(value: number) {
    let _per_page = parseInt(value as any);
    if (Number.isNaN(_per_page) || _per_page <= 0) {
      _per_page = SearchParams.PER_PAGE;
    }

    this._per_page = _per_page;
  }

  get sort() {
    return this._sort;
  }

  set sort(value: string | null) {
    this._sort = value === undefined || value === null || value === '' ? null : `${value}`;
  }

  get sort_dir() {
    return this._sort_dir;
  }

  set sort_dir(value: SortDirection | null) {
    if(!this.sort) {
      this._sort_dir = null;
      return;
    }

    const dir = `${value}`.toLowerCase();
    this._sort_dir = dir !== 'asc' && dir !== 'desc' ? 'asc' : dir;     
  }

  get filter() {
    return this._filter;
  }

  private set filter(value: Filter | null) {
    this._filter = value === null || value === undefined || (value as unknown) === "" ? null : `${value}` as any;
  }
}

type SearchResultProps<E extends Entity, Filter> = {
  items: E[];
  total: number;
  current_page: number;
  per_page: number;
  sort?: string | null;
  sort_dir?: string | null;
  filter?: Filter | null;
}

export class SearchResult<E extends Entity, Filter = string> {
  readonly items: E[];
  readonly total: number;
  readonly current_page: number;
  readonly per_page: number;
  readonly last_page: number;
  readonly sort?: string | null;
  readonly sort_dir?: string | null;
  readonly filter?: Filter | null;

  constructor(props: SearchResultProps<E, Filter>) {
    this.items = props.items;
    this.total = props.total;
    this.current_page = props.current_page;
    this.per_page = props.per_page;
    this.sort = props.sort;
    this.sort_dir = props.sort_dir;
    this.filter = props.filter;

    const _last_page = Math.ceil(props.total / props.per_page);
    this.last_page = _last_page > 0 ? _last_page : 1;
  }

  toJSON() {
    return {
      items: this.items,
      total: this.total,
      current_page: this.current_page,
      per_page: this.per_page,
      last_page: this.last_page,
      sort: this.sort,
      sort_dir: this.sort_dir,
      filter: this.filter
    }
  }

}

export interface SearchableRepositoryInterface<
  E extends Entity,
  Filter = string,
  SearchInput = SearchParams,
  SearchOutput = SearchResult<E, Filter>
> extends RepositoryInterface<E> {
  sortableFields: string[];
  search(props: SearchInput) : Promise<SearchOutput>;
}