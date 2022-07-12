import { InMemorySearchableRepository } from "../../@seedwork/domain/repository/in-memory.repository";
import { SearchParams, SearchResult } from "../../@seedwork/domain/repository/repository-contracts";
import { Category } from "../domain/entities/category";
import CategoryInMemoryRepository from "./category-in-memory.repository";

describe('CategoryInMemoryRepository Unit Tests', () => {
  describe('applyFilter method', () => {
    it('should not apply filter when filter param is null', async () => {
      const categoryRepository = new CategoryInMemoryRepository();
      const items = [
        new Category({ name: 'Name' }),
        new Category({ name: 'TEST' }),
      ]
      const filtredItems = await categoryRepository['applyFilter'](items);
      expect(filtredItems).toStrictEqual(items);
    });

    it('should apply name category filter ', async () => {
      const categoryRepository = new CategoryInMemoryRepository();
      const items = [
        new Category({ name: 'Name' }),
        new Category({ name: 'TEST' }),
        new Category({ name: 'test' }),
      ]
      const filtredItems = await categoryRepository['applyFilter'](items, 'tes');
      expect(filtredItems).toStrictEqual([items[1], items[2]]);
    });
  });

  describe('search method', () => {
    it('should order items with created_at asc when sort is undefined', async () => {
      const spyRepository = jest.spyOn(InMemorySearchableRepository.prototype, 'search');
      const items = [
        new Category({ name: 'Name', created_at: new Date('2022-01-03 00:00:00') }),
        new Category({ name: 'TEST', created_at: new Date('2022-01-01 00:00:00') }),
        new Category({ name: 'test', created_at: new Date('2022-01-02 00:00:00') }),
      ];
      const categoryRepository = new CategoryInMemoryRepository();
      categoryRepository.items = items;
      const searchResult = await categoryRepository.search(
        new SearchParams()
      );

      
      expect(searchResult).toStrictEqual(
        new SearchResult({
          items: [items[1], items[2], items[0]],
          filter: null,
          current_page: 1,
          per_page: 15,
          total: 3,
          sort: 'created_at',
          sort_dir: 'asc'
        })
      );
      expect(spyRepository).toHaveBeenCalledWith(new SearchParams({
        sort: 'created_at',
        sort_dir: 'asc'
      }));
    });

    it('should order items with sort and sort_dir params', async () => {
      const spyRepository = jest.spyOn(InMemorySearchableRepository.prototype, 'search');
      const items = [
        new Category({ name: 'TEST', created_at: new Date('2022-01-01 00:00:00') }),
        new Category({ name: 'Name', created_at: new Date('2022-01-03 00:00:00') }),
        new Category({ name: 'test', created_at: new Date('2022-01-02 00:00:00') }),
      ];
      const categoryRepository = new CategoryInMemoryRepository();
      categoryRepository.items = items;
      const searchResult = await categoryRepository.search(
        new SearchParams({
          sort: 'name',
          sort_dir: 'desc'
        })
      );

      
      expect(searchResult).toStrictEqual(
        new SearchResult({
          items: [items[2], items[0], items[1]],
          filter: null,
          current_page: 1,
          per_page: 15,
          total: 3,
          sort: 'name',
          sort_dir: 'desc'
        })
      );
      expect(spyRepository).toHaveBeenCalledWith(new SearchParams({
        sort: 'name',
        sort_dir: 'desc'
      }));
    });
  })
});