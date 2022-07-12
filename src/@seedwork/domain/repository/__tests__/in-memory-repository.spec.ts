import Entity from "../../entity/entity";
import NotFoundError from "../../errors/not-found.error";
import UniqueEntityId from "../../value-objects/unique-entity-id.vo";
import { InMemoryRepository } from "../in-memory.repository";

type StubEntityProps = {
  name: string,
  price: number;
}

class StubEntity extends Entity<StubEntityProps> {}
class StubInMemoryRepository extends InMemoryRepository<StubEntity> {}
describe('InMemoryRepository Unit Tests', () => {
  let repository: StubInMemoryRepository;

  beforeEach(() => {
    repository = new StubInMemoryRepository();
  });

  it('should insert a new Entity', async () => {
    const entity = new StubEntity({
      name: 'Name',
      price: 5
    });

    repository.insert(entity);

    const entities = await repository.findAll();
    expect(entities).toHaveLength(1);
    expect(entity.toJSON()).toStrictEqual(entity.toJSON());
  });

  it('should throw error when entity not found', () => {
    expect(repository.findById('invalid id')).rejects.toThrow(
      new NotFoundError('Entity not found using id invalid id')
    );
    expect(() => repository.findById(new UniqueEntityId('22ba0955-51b6-490f-bb76-9c19d32becd4'))).rejects.toThrow(
      new NotFoundError('Entity not found using id 22ba0955-51b6-490f-bb76-9c19d32becd4')
    );
  });

  it('should finds a entity by id', async () => {
    const entity = new StubEntity({
      name: 'Name',
      price: 5
    });

    await repository.insert(entity);

    let entityFound = await repository.findById(entity.id);
    expect(entityFound.toJSON()).toStrictEqual(entity.toJSON());

    entityFound = await repository.findById(new UniqueEntityId(entity.id));
    expect(entityFound.toJSON()).toStrictEqual(entity.toJSON());
  });

  it('should return all entities', async () => {
    const entity = new StubEntity({
      name: 'Name',
      price: 5
    });

    await repository.insert(entity);

    const entities = await repository.findAll();
    expect(entities).toStrictEqual([entity]);
  });

  it('should throw error on update when entity not found', async () => {
    const entity = new StubEntity({
      name: 'Name',
      price: 5
    }, new UniqueEntityId('22ba0955-51b6-490f-bb76-9c19d32becd4'));

    expect(() => repository.update(entity)).rejects.toThrowError(
      new NotFoundError('Entity not found using id 22ba0955-51b6-490f-bb76-9c19d32becd4')
    );
  });

  it('should update entity', async () => {
    const entity = new StubEntity({
      name: 'Name',
      price: 5
    });

    await repository.insert(entity);

    const entityUpdated = new StubEntity({
      name: 'updated',
      price: 1
    }, entity.uniqueEntityId);

    await repository.update(entityUpdated);

    const entities = await repository.findAll();
    expect(entities).toStrictEqual([entityUpdated])
  });

  it('should throw error on delete when entity not found', async () => {
    expect(() => repository.delete('fake id')).rejects.toThrowError(
      new NotFoundError('Entity not found using id fake id')
    );
    expect(() => repository.delete(new UniqueEntityId('22941237-3322-4fc1-8ee6-f0864cec70e8'))).rejects.toThrowError(
      new NotFoundError('Entity not found using id 22941237-3322-4fc1-8ee6-f0864cec70e8')
    );
  });

  it('should delete an entity', async () => {
    const entity = new StubEntity({
      name: 'Name',
      price: 5
    });

    await repository.insert(entity);
    await repository.delete(entity.id);

    let entities = await repository.findAll();
    expect(entities).toHaveLength(0);

    await repository.insert(entity);
    await repository.delete(entity.uniqueEntityId);

    entities = await repository.findAll();
    expect(entities).toHaveLength(0);
  });
});