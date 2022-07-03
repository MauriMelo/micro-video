import UniqueEntityId from "../value-objects/unique-entity-id.vo";
import Entity from "./entity";
import { validate as uuidValidate } from 'uuid';

interface SubEntityProps {
  prop: string,
  name: string;
}
class StubEntity extends Entity<SubEntityProps> { }
describe('Entity Unity Tests', () => {
  it('should set props and id', () => {
    const stubEntityProps = { prop: 'props1', name: 'name' };
    const entity = new StubEntity({ prop: 'props1', name: 'name' });
    expect(entity.props).toStrictEqual(stubEntityProps);
    expect(entity.uniqueEntityId).toBeInstanceOf(UniqueEntityId);
    expect(uuidValidate(entity.id)).toBeTruthy();
  });

  it ('should accepts a valid uuid', () => {
    const stubEntityProps = { prop: 'props1', name: 'name' };
    const uniqueEntityId = new UniqueEntityId();
    const entity = new StubEntity(stubEntityProps, uniqueEntityId);
    expect(entity.uniqueEntityId).toBeInstanceOf(UniqueEntityId); 
    expect(entity.id).toBe(uniqueEntityId.value);
  });

  it ('should convert a etitity to a JavaScript Object', () => {
    const stubEntityProps = { prop: 'props1', name: 'name' };
    const uniqueEntityId = new UniqueEntityId();
    const entity = new StubEntity(stubEntityProps, uniqueEntityId);
    expect(entity.toJSON()).toStrictEqual({
      id: uniqueEntityId.value,
      ...stubEntityProps
    });
  });
})