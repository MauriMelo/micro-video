import { Category } from "../../../domain/entities/category";
import { SearchResult } from "../../../../@seedwork/domain/repository/repository-contracts";
import CategoryInMemoryRepository from "../../../infra/category-in-memory.repository";
import ListCategoriesUseCase from "../list-categories.use-case";

describe('ListCategoriesUseCase Unit Case', () => {

  test('toOutput method', () => {
    const repository = new CategoryInMemoryRepository();
    const useCase = new ListCategoriesUseCase(repository);
    const category = new Category({ name: 'Movie' });
    const searchResult = new SearchResult({
      items: [category],
      current_page: 1,
      per_page: 1,
      total: 10,
      filter: null,
      sort: 'name',
      sort_dir: 'asc'
    });

    expect(useCase.toOutput(searchResult)).toStrictEqual({
      items: [category.toJSON()],
      total: 10,
      current_page: 1,
      last_page: 10,
      per_page: 1
    });
  });

  it('should search categories order by created_at', async () => {
    const categories = [
      new Category({ name: 'Movie', created_at: new Date('2022-01-02 00:00:00')}),
      new Category({ name: 'Movie', created_at: new Date('2022-01-01 00:00:00')}),
      new Category({ name: 'Movie', created_at: new Date('2022-01-03 00:00:00')})
    ];
    const repository = new CategoryInMemoryRepository();
    repository.items = categories;
    const useCase = new ListCategoriesUseCase(repository);
    const output = await useCase.execute();
    expect(output).toStrictEqual({
      items: [categories[1].toJSON(), categories[0].toJSON(), categories[2].toJSON()],
      total: 3,
      current_page: 1,
      last_page: 1,
      per_page: 15
    });
  });

  it('should search categories filted by name', async () => {
    const categories = [
      new Category({ name: 'Movie', created_at: new Date('2022-01-02 00:00:00')}),
      new Category({ name: 'filtred', created_at: new Date('2022-01-01 00:00:00')}),
      new Category({ name: 'Movie', created_at: new Date('2022-01-03 00:00:00')})
    ];
    const repository = new CategoryInMemoryRepository();
    repository.items = categories;
    const useCase = new ListCategoriesUseCase(repository);
    const output = await useCase.execute({
      filter: 'filtred'
    });
    expect(output).toStrictEqual({
      items: [categories[1].toJSON()],
      total: 1,
      current_page: 1,
      last_page: 1,
      per_page: 15
    });
  });

  it('should search categories with paginate', async () => {
    const categories = [
      new Category({ name: 'Movie', created_at: new Date('2022-01-02 00:00:00')}),
      new Category({ name: 'Movie', created_at: new Date('2022-01-01 00:00:00')}),
      new Category({ name: 'Movie', created_at: new Date('2022-01-03 00:00:00')})
    ];
    const repository = new CategoryInMemoryRepository();
    repository.items = categories;
    const useCase = new ListCategoriesUseCase(repository);
    const output = await useCase.execute({
      per_page: 1,
      page: 2
    });
    expect(output).toStrictEqual({
      items: [categories[0].toJSON()],
      total: 3,
      current_page: 2,
      last_page: 3,
      per_page: 1
    });
  });
});