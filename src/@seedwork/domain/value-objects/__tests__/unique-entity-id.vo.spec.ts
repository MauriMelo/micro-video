import InvalidUuidError from "../../errors/invalid-uuid.error";
import UniqueEntityId from "../unique-entity-id.vo";
import { validate as uuidValidate } from 'uuid';

describe("UniqueEntityId Unit Test", () => {
  it('shound throw error when uuid is invalid', () => {
    const validateSpy = jest.spyOn(UniqueEntityId.prototype as any, 'validate');
    expect(() => new UniqueEntityId('fake id')).toThrow(new InvalidUuidError());
    expect(validateSpy).toHaveBeenCalled();
  });

  it('should accept a uuid passed in constructor', () => {
    const validateSpy = jest.spyOn(UniqueEntityId.prototype as any, 'validate');
    let uniqueEntityId = new UniqueEntityId('32c4019b-77e8-461a-94ad-d1236714ec8d');
    expect(uniqueEntityId.value).toBe('32c4019b-77e8-461a-94ad-d1236714ec8d');
    expect(validateSpy).toHaveBeenCalled();

    uniqueEntityId = new UniqueEntityId();
    expect(uuidValidate(uniqueEntityId.value)).toBeTruthy();
    expect(validateSpy).toHaveBeenCalled();
  });

  it('should accept a uuid in constructor', () => {
    const validateSpy = jest.spyOn(UniqueEntityId.prototype as any, 'validate');
    const uniqueEntityId = new UniqueEntityId();
    expect(uuidValidate(uniqueEntityId.value)).toBeTruthy();
    expect(validateSpy).toHaveBeenCalled();
  });
});