import NotFoundError from "../../../../@seedwork/domain/errors/not-found.error";
import { Category } from "../../../domain/entities/category";
import CategoryInMemoryRepository from "../../../infra/category-in-memory.repository";
import UpdateCategoryUseCase from "../update-category.use-case"

describe('UpdateCategoryUseCase Unit Tests', () => {
  let useCase: UpdateCategoryUseCase;
  let repository: CategoryInMemoryRepository;

  beforeEach(() => {
    repository = new CategoryInMemoryRepository();
    useCase = new UpdateCategoryUseCase(repository);
  });

  it('should trigger NotFoundError error when entity not exist', async () => {
    expect(() => useCase.execute({ id: 'fake id', name: 'Movie update' })).rejects.toThrowError(
      new NotFoundError('Entity not found using id fake id')
    );
  });

  it('should update a category', async () => {
    const spyUpdate = jest.spyOn(repository, 'update');
    const categories = [
      new Category({ name: 'Movie' })
    ]
    repository.items = categories;

    let output = await useCase.execute({ id: categories[0].id, name: 'Movie update' });
    expect(spyUpdate).toBeCalledTimes(1);
    expect(output).toStrictEqual({
      id: categories[0].id,
      name: 'Movie update',
      description: null,
      is_active: true,
      created_at: categories[0].created_at
    });
  });

  it('should active category when is_active prop is true', async () => {
    const spyUpdate = jest.spyOn(repository, 'update');
    const spyActivate = jest.spyOn(Category.prototype, 'activate');
    const categories = [
      new Category({ name: 'Movie', is_active: false })
    ]
    repository.items = categories;

    let output = await useCase.execute({ 
      id: categories[0].id,
      name: 'Movie update',
      is_active: true
    });
    expect(spyActivate).toBeCalledTimes(1);
    expect(spyUpdate).toBeCalledTimes(1);
    expect(output).toStrictEqual({
      id: categories[0].id,
      name: 'Movie update',
      description: null,
      is_active: true,
      created_at: categories[0].created_at
    });
  });

  it('should deactivate category when is_active prop is false', async () => {
    const spyUpdate = jest.spyOn(repository, 'update');
    const spyDeactivate = jest.spyOn(Category.prototype, 'deactivate');
    const categories = [
      new Category({ name: 'Movie' })
    ];

    repository.items = categories;

    let output = await useCase.execute({ 
      id: categories[0].id,
      name: 'Movie update',
      is_active: false
    });
    
    expect(spyDeactivate).toBeCalledTimes(1);
    expect(spyUpdate).toBeCalledTimes(1);
    expect(output).toStrictEqual({
      id: categories[0].id,
      name: 'Movie update',
      description: null,
      is_active: false,
      created_at: categories[0].created_at
    });
  });

  it('should set description to null when description prop is undefined', async () => {
    const spyUpdate = jest.spyOn(repository, 'update');
    const categories = [
      new Category({ name: 'Movie', description: 'description' })
    ];

    repository.items = categories;

    let output = await useCase.execute({ 
      id: categories[0].id,
      name: 'Movie update',
    });
    
    expect(spyUpdate).toBeCalledTimes(1);
    expect(output).toStrictEqual({
      id: categories[0].id,
      name: 'Movie update',
      description: null,
      is_active: true,
      created_at: categories[0].created_at
    });
  });
})