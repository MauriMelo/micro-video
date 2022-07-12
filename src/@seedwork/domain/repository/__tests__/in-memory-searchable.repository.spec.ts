import Entity from '../../entity/entity';
import { InMemorySearchableRepository } from '../in-memory.repository';
import { SearchParams, SearchResult } from '../repository-contracts';

interface StubEntityProps {
  name: string;
  price: number;
}

class StubEntity extends Entity<StubEntityProps> {}

class StubInMemorySearchableRepository extends InMemorySearchableRepository<StubEntity> {
  sortableFields: string[] = ['name', 'price'];
  protected async applyFilter(items: StubEntity[], filter?: string): Promise<StubEntity[]> {
    if(!filter) {
      return items;
    }

    const filterLowerCase = filter.toLowerCase();
    return items.filter(i => 
      i.props.name.toLowerCase().includes(filterLowerCase) || 
      i.props.price.toString() === filterLowerCase
    );
  }
}

describe('StubInMemorySearchableRepository unit tests', () => {
  let repository: StubInMemorySearchableRepository
  beforeEach(() => {
    repository = new StubInMemorySearchableRepository();
  });

  describe('applyFilter method', () => {
    it('should no filter items when filter params is null', async () => {
      const items = [
        new StubEntity({ name: 'Name', price: 5 })
      ];
      const itemsFiltred = await repository['applyFilter'](items);
      expect(itemsFiltred).toStrictEqual(items);
    });

    it('should filter using a filter param', async () => {
      const items = [
        new StubEntity({ name: 'Name', price: 5 }),
        new StubEntity({ name: 'NAME', price: 6 }),
        new StubEntity({ name: 'fake', price: 10 })
      ];

      let itemsFiltred = await repository['applyFilter'](items, 'name');
      expect(itemsFiltred).toStrictEqual([items[0], items[1]]);

      itemsFiltred = await repository['applyFilter'](items, '10');
      expect(itemsFiltred).toStrictEqual([items[2]]);
    });
  });
  describe('applySort method', () => {
    it('should not sort items when sort params is null', async () => {
      const items = [
        new StubEntity({ name: 'Name', price: 5 }),
        new StubEntity({ name: 'NAME', price: 6 }),
        new StubEntity({ name: 'fake', price: 10 })
      ];

      let itemsSorted = await repository['applySort'](items);
      expect(itemsSorted).toStrictEqual(items);

      itemsSorted = await repository['applySort'](items, 'price', 'asc');
      expect(itemsSorted).toStrictEqual(items);
    });

    it('should sort items', async () => {
      const items = [
        new StubEntity({ name: 'b', price: 5 }),
        new StubEntity({ name: 'a', price: 6 }),
        new StubEntity({ name: 'c', price: 10 })
      ];

      let itemsSorted = await repository['applySort'](items, 'name', 'asc');
      expect(itemsSorted).toStrictEqual([items[1], items[0], items[2]]);

      itemsSorted = await repository['applySort'](items, 'name', 'desc');
      expect(itemsSorted).toStrictEqual([items[2], items[0], items[1]]);
    });
  });

  describe('applyPaginate method', () => {
    it('should paginate items', async () => {
      const items = [
        new StubEntity({ name: 'a', price: 6 }),
        new StubEntity({ name: 'b', price: 6 }),
        new StubEntity({ name: 'c', price: 6 }),
        new StubEntity({ name: 'd', price: 6 }),
        new StubEntity({ name: 'e', price: 6 }),
      ];

      let itemsSorted = await repository['applyPaginate'](items, 1, 2);
      expect(itemsSorted).toStrictEqual([items[0], items[1]]);

      itemsSorted = await repository['applyPaginate'](items, 2, 2);
      expect(itemsSorted).toStrictEqual([items[2], items[3]]);

      itemsSorted = await repository['applyPaginate'](items, 3, 2);
      expect(itemsSorted).toStrictEqual([items[4]]);
    });
  });

  describe('search method', () => {
    it('should apply paginate with default search params', async () => {
      const entity = new StubEntity({ name: 'Name', price: 5 });
      const items = Array(16).fill(entity);
      repository = new StubInMemorySearchableRepository();
      repository.items = items;
      const result = await repository.search(new SearchParams());
      expect(result).toStrictEqual(new SearchResult({
        items: Array(15).fill(entity),
        current_page: 1,
        filter: null,
        per_page: 15,
        sort: null,
        sort_dir: null,
        total: 16,
      }));
    });
    
    it('should apply paginate and filter with default search params', async () => {
      const entity = new StubEntity({ name: 'Name', price: 5 });
      const items = Array(16).fill(entity);
      repository.items = items;
      const result = await repository.search(new SearchParams());
      expect(result).toStrictEqual(new SearchResult({
        items: Array(15).fill(entity),
        current_page: 1,
        filter: null,
        per_page: 15,
        sort: null,
        sort_dir: null,
        total: 16,
      }));
    });

    it('should apply paginate and filter with default search params', async () => {
      const items = [
        new StubEntity({ name: 'Test', price: 5 }),
        new StubEntity({ name: 'TEST', price: 5 }),
        new StubEntity({ name: 'fake', price: 5 }),
        new StubEntity({ name: 'TEsT', price: 5 }),
        new StubEntity({ name: 'other fake', price: 5 })
      ];

      repository.items = items;
      let result = await repository.search(new SearchParams({
        filter: 'TEST',
        page: 1,
        per_page: 2
      }));

      expect(result).toStrictEqual(new SearchResult({
        items: [items[0], items[1]],
        current_page: 1,
        filter: 'TEST',
        per_page: 2,
        sort: null,
        sort_dir: null,
        total: 3,
      }));

      result = await repository.search(new SearchParams({
        filter: 'TEST',
        page: 2,
        per_page: 2
      }));

      expect(result).toStrictEqual(new SearchResult({
        items: [items[3]],
        current_page: 2,
        filter: 'TEST',
        per_page: 2,
        sort: null,
        sort_dir: null,
        total: 3,
      }));
    });

    it('should apply paginate and sort', async () => {
      const items = [
        new StubEntity({ name: 'c', price: 5 }),
        new StubEntity({ name: 'a', price: 5 }),
        new StubEntity({ name: 'd', price: 5 }),
        new StubEntity({ name: 'b', price: 5 }),
        new StubEntity({ name: 'e', price: 5 })
      ];

      repository.items = items;
      const arrange = [
        {
          params: new SearchParams({
            page: 1,
            per_page: 2,
            sort: 'name'
          }),
          result: new SearchResult({
            items: [items[1], items[3]],
            current_page: 1,
            filter: null,
            per_page: 2,
            sort: 'name',
            sort_dir: 'asc',
            total: 5,
          })
        },
        {
          params: new SearchParams({
            page: 1,
            per_page: 2,
            sort: 'name',
            sort_dir: 'desc'
          }),
          result: new SearchResult({
            items: [items[4], items[2]],
            current_page: 1,
            filter: null,
            per_page: 2,
            sort: 'name',
            sort_dir: 'desc',
            total: 5,
          })
        },
        {
          params: new SearchParams({
            page: 2,
            per_page: 2,
            sort: 'name',
            sort_dir: 'asc'
          }),
          result: new SearchResult({
            items: [items[0], items[2]],
            current_page: 2,
            filter: null,
            per_page: 2,
            sort: 'name',
            sort_dir: 'asc',
            total: 5,
          })
        },
        {
          params: new SearchParams({
            page: 2,
            per_page: 2,
            sort: 'name',
            sort_dir: 'desc'
          }),
          result: new SearchResult({
            items: [items[0], items[3]],
            current_page: 2,
            filter: null,
            per_page: 2,
            sort: 'name',
            sort_dir: 'desc',
            total: 5,
          })
        }
      ];

      for (const i of arrange) {
        let result = await repository.search(i.params);
        expect(result).toStrictEqual(i.result);
      }
    });

    it('should apply paginate, sort and filter', async () => {
      const items = [
        new StubEntity({ name: 'test', price: 5 }),
        new StubEntity({ name: 'a', price: 5 }),
        new StubEntity({ name: 'TEST', price: 5 }),
        new StubEntity({ name: 'e', price: 5 }),
        new StubEntity({ name: 'TeSt', price: 5 })
      ];

      repository.items = items;
      const arrange = [
        {
          params: new SearchParams({
            filter: 'TEST',
            page: 1,
            per_page: 2,
            sort: 'name'
          }),
          result: new SearchResult({
            items: [items[2], items[4]],
            current_page: 1,
            filter: 'TEST',
            per_page: 2,
            sort: 'name',
            sort_dir: 'asc',
            total: 3,
          })
        },
        {
          params: new SearchParams({
            filter: 'TEST',
            page: 2,
            per_page: 2,
            sort: 'name'
          }),
          result: new SearchResult({
            items: [items[0]],
            current_page: 2,
            filter: 'TEST',
            per_page: 2,
            sort: 'name',
            sort_dir: 'asc',
            total: 3,
          })
        },
      ];

      for (const i of arrange) {
        let result = await repository.search(i.params);
        expect(result).toStrictEqual(i.result);
      }
    });
  });
})