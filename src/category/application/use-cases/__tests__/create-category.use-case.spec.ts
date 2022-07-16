import CategoryInMemoryRepository from "../../../infra/category-in-memory.repository";
import CreateCategoryUseCase from "../create-category.use-case"

describe('CreateCategoryUseCase Unit Tests', () => {
  let useCase: CreateCategoryUseCase;
  let repository: CategoryInMemoryRepository;

  beforeEach(() => {
    repository = new CategoryInMemoryRepository();
    useCase = new CreateCategoryUseCase(repository);
  });

  it('should create a category', async () => {
    let spyInsert = jest.spyOn(repository, 'insert');
    let output = await useCase.execute({ name: 'Test' });
    expect(spyInsert).toBeCalledTimes(1);
    expect(output).toStrictEqual({
      id: repository.items[0].id,
      name: 'Test',
      description: null,
      is_active: true,
      created_at: repository.items[0].created_at
    });

    output = await useCase.execute({ 
      name: 'Test',
      description: 'same description',
      is_active: false
    });

    expect(output).toStrictEqual({
      id: repository.items[1].id,
      name: 'Test',
      description: 'same description',
      is_active: false,
      created_at: repository.items[1].created_at
    });
  });
})