import { SearchParams, SearchResult } from "../repository-contracts";

describe('Search Unit Tests', () => {
  describe('SearchParams Unit Tests', () => {
    test('page prop', () => {
      const arrange = [
        { page: null as any, expected: 1 },
        { page: undefined, expected: 1 },
        { page: -1, expected: 1 },
        { page: "fake", expected: 1 },
        { page: 0, expected: 1 },
        { page: {}, expected: 1 },
        { page: false, expected: 1 },
        { page: true, expected: 1 },
        { page: 1, expected: 1 },
        { page: 2, expected: 2 },
        { page: 2.9, expected: 2 },
      ];
  
      arrange.forEach(item => {
        expect(new SearchParams({
          page: item.page
        }).page).toBe(item.expected);
      })
    });
  
    test('per_page prop', () => {
      const params = new SearchParams();
      expect(params.per_page).toBe(15);
  
      const arrange = [
        { per_page: null as any, expected: 15 },
        { per_page: undefined, expected: 15 },
        { per_page: -1, expected: 15 },
        { per_page: "fake", expected: 15 },
        { per_page: 0, expected: 15 },
        { per_page: {}, expected: 15 },
        { per_page: false, expected: 15 },
        { per_page: true, expected: 15 },
        { per_page: 1, expected: 1 },
        { per_page: 2, expected: 2 },
        { per_page: 2.9, expected: 2 },
      ];
  
      arrange.forEach(item => {
        expect(new SearchParams({
          per_page: item.per_page
        }).per_page).toBe(item.expected);
      })
    });
  
    test('sort prop', () => {
      const params = new SearchParams();
      expect(params.sort).toBe(null);
  
      const arrange = [
        { sort: null as any, expected: null as any },
        { sort: undefined, expected: null },
        { sort: -1, expected: '-1' },
        { sort: "fake", expected: 'fake' },
        { sort: true, expected: 'true' },
        { sort: false, expected: 'false' },
        { sort: false, expected: 'false' },
        { sort: {}, expected: '[object Object]' },
      ];
  
      arrange.forEach(item => {
        expect(new SearchParams({
          sort: item.sort
        }).sort).toBe(item.expected);
      });
    });
  
    test('sort_dir prop', () => {
      let params = new SearchParams();
      expect(params.sort_dir).toBe(null);
  
      params = new SearchParams({ sort: undefined });
      expect(params.sort_dir).toBe(null);
  
      params = new SearchParams({ sort: "" });
      expect(params.sort_dir).toBe(null);
  
      const arrange = [
        { sort_dir: null as any, expected: 'asc' },
        { sort_dir: undefined, expected: 'asc' },
        { sort_dir: "", expected: 'asc' },
        { sort_dir: "fake", expected: 'asc' },
        { sort_dir: "0", expected: 'asc' },
  
        { sort_dir: "asc", expected: 'asc' },
        { sort_dir: "ASC", expected: 'asc' },
        { sort_dir: "desc", expected: 'desc' },
        { sort_dir: "DESC", expected: 'desc' },
      ];
  
      arrange.forEach(item => {
        expect(new SearchParams({
          sort: 'fake',
          sort_dir: item.sort_dir
        }).sort_dir).toBe(item.expected);
      });
    });
  
    test('filter prop', () => {
      const params = new SearchParams();
      expect(params.filter).toBe(null);
  
      const arrange = [
        { filter: null as any, expected: null as any },
        { filter: undefined, expected: null },
        { filter: "", expected: null },
        { filter: -1, expected: '-1' },
        { filter: "fake", expected: 'fake' },
        { filter: true, expected: 'true' },
        { filter: false, expected: 'false' },
        { filter: false, expected: 'false' },
        { filter: {}, expected: '[object Object]' },
      ];
  
      arrange.forEach(item => {
        expect(new SearchParams({
          filter: item.filter
        }).filter).toBe(item.expected);
      });
    });
  });
  
  describe('SearchResult Unit Test', () => {
    test('constructor props', () => {
      const result = new SearchResult({
        items: ["item", "item"] as any,
        total: 4,
        current_page:  1,
        per_page:  2,
        sort:  null,
        sort_dir:  null,
        filter:  null
      });
  
      expect(result.toJSON()).toStrictEqual({
        items: ["item", "item"],
        total: 4,
        current_page:  1,
        per_page:  2,
        last_page: 2,
        sort:  null,
        sort_dir:  null,
        filter:  null
      });
    });
  
    it('should set last_page = 1 when per_page field is greather than total field', () => {
      const result = new SearchResult({
        items: ["item", "item"] as any,
        total: 2,
        current_page:  1,
        per_page: 4,
        sort:  null,
        sort_dir:  null,
        filter:  null
      });
  
      expect(result.toJSON()).toStrictEqual({
        items: ["item", "item"],
        total: 2,
        current_page:  1,
        per_page:  4,
        last_page: 1,
        sort:  null,
        sort_dir:  null,
        filter:  null
      });
    });
  
    it('should round last_page up to the next largest integer', () => {
      const result = new SearchResult({
        items: ["item", "item"] as any,
        total: 101,
        current_page:  1,
        per_page: 20,
        sort:  null,
        sort_dir:  null,
        filter:  null
      });
  
      expect(result.toJSON()).toStrictEqual({
        items: ["item", "item"],
        total: 101,
        current_page:  1,
        per_page:  20,
        last_page: 6,
        sort:  null,
        sort_dir:  null,
        filter:  null
      });
    });
  });
});