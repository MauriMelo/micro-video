import { Category } from "../../../../category/domain/entities/category";
import NotFoundError from "../../../../@seedwork/domain/errors/not-found.error";
import CategoryInMemoryRepository from "../../../infra/category-in-memory.repository";
import GetCategoryUseCase from "../get-category.use-case"

describe('GetCategoryUseCase Unit Tests', () => {
  let useCase: GetCategoryUseCase;
  let repository: CategoryInMemoryRepository;

  beforeEach(() => {
    repository = new CategoryInMemoryRepository();
    useCase = new GetCategoryUseCase(repository);
  });

  it('should throw error when entity not found', async () => {
    expect(() => useCase.execute({ id: 'fake-id' })).rejects.toThrowError(
      new NotFoundError('Entity not found using id fake-id')
    );
  });

  it('should get a category', async () => {
    const items = [
      new Category({name: 'Movie'})
    ];
    const findByIdSpy = jest.spyOn(repository, 'findById');

    repository.items = items;
    const category = await useCase.execute({id: items[0].id});

    expect(findByIdSpy).toHaveBeenCalledTimes(1);
    expect(category).toStrictEqual({
      id: items[0].id,
      name: 'Movie',
      description: null,
      is_active: true,
      created_at: items[0].created_at
    });
  });
})