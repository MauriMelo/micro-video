import Entity from "../entity/entity";
import NotFoundError from "../errors/not-found.error";
import UniqueEntityId from "../value-objects/unique-entity-id.vo";
import { RepositoryInterface, SearchableRepositoryInterface, SearchParams, SearchResult, SortDirection } from "./repository-contracts";

export abstract class InMemoryRepository<E extends Entity> implements RepositoryInterface<Entity> {

  items: E[] = [];

  async insert(entity: E): Promise<void> {
    this.items.push(entity);
  }

  async findById(id: string | UniqueEntityId): Promise<E> {
    return this._get(`${id}`);
  }

  async findAll(): Promise<E[]> {
    return this.items;
  }

  async update(entity: E): Promise<void> {
    const _entity = await this._get(entity.id);
    Object.assign(_entity, entity);
  }

  async delete(id: string | UniqueEntityId): Promise<void> {
    const _id = `${id}`;
    const index = this.items.findIndex(i => i.id === _id);
    if (index === -1) {
      throw new NotFoundError(`Entity not found using id ${id}`);
    }

    this.items.splice(index, 1);
  }

  protected async _get(id: string): Promise<E> {
    const entity = this.items.find(i => i.id === id);
    if (!entity) {
      throw new NotFoundError(`Entity not found using id ${id}`);
    }
    return entity;
  }
}

export abstract class InMemorySearchableRepository<E extends Entity> 
  extends InMemoryRepository<E> 
  implements SearchableRepositoryInterface<E> {
  sortableFields: string[] = [];
  async search(props: SearchParams): Promise<SearchResult<E, string>> {
    const itemsFiltred = await this.applyFilter(this.items, props.filter);
    const itemsSorted = await this.applySort(itemsFiltred, props.sort, props.sort_dir);
    const itemsPaginated = await this.applyPaginate(itemsSorted, props.page, props.per_page);

    return new SearchResult({
      items: itemsPaginated,
      total: itemsFiltred.length,
      current_page: props.page,
      per_page: props.per_page,
      sort: props.sort,
      sort_dir: props.sort_dir,
      filter: props.filter,
    });
  }

  protected abstract applyFilter(items: E[], filter: string | null): Promise<E[]>

  protected async applySort(items: E[], sort?: string, sort_dir?: SortDirection | null) {
    if (!sort || !this.sortableFields.includes(sort)) {
      return items;
    }

    return [...items].sort((a, b) => {
      if (a.props[sort] < b.props[sort]) {
        return sort_dir === 'asc' ? -1 : 1;
      } else if (a.props[sort] > b.props[sort]) {
        return sort_dir === 'asc' ? 1 : -1;
      }

      return 0
    });
  }
  
  protected async applyPaginate(items: E[], page: SearchParams['page'], per_page: SearchParams["per_page"]) {
    const start = (page -1) * per_page;
    const limit = start + per_page;
    return items.slice(start, limit);
  }

}