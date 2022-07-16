import { Category } from "../../../domain/entities/category";
import NotFoundError from "../../../../@seedwork/domain/errors/not-found.error";
import CategoryInMemoryRepository from "../../../infra/category-in-memory.repository";
import RemoveCategoryUseCase from "../remove-category.use-case";

describe('RemoveCategoryUseCase', () => {
  it('should throw NotFoundError when category not exist', () => {
    const repository = new CategoryInMemoryRepository();
    const useCase = new RemoveCategoryUseCase(repository);
    expect(() => useCase.execute({ id: 'fake-id' })).rejects.toThrowError(
      new NotFoundError(`Entity not found using id fake-id`)
    );
  });

  it('should remove category', async () => {
    const categories = [
      new Category({ name: 'Movie' }),
      new Category({ name: 'Serie' }),
    ];
    const repository = new CategoryInMemoryRepository();
    repository.items = categories;
    const useCase = new RemoveCategoryUseCase(repository);
    const result = await useCase.execute({ id: categories[0].id });
    expect(repository.items).toHaveLength(1);
    expect(result).toBe(true);
  });
});