import { InvalidVoError } from "../../errors/invalid-vo.error";
import ValueObject from "../value-object";

class StubValueObject extends ValueObject {}

describe('ValueObject', () => {
  it('should set value', () => {
    let vo = new StubValueObject('string value');
    expect(vo.value).toBe('string value');

    vo = new StubValueObject(() => true);
    expect(vo.value).toStrictEqual(vo.value);
  });

  it('value should be valid', () => {
    expect(() => new StubValueObject(null)).toThrow(InvalidVoError);
    expect(() => new StubValueObject(undefined)).toThrow(InvalidVoError);

    let vo = new StubValueObject(false);
    expect(vo.value).toBe(false);
  });

  it('should convert to a string', () => {
    const date = new Date();
    const arrange = [
      { received: 'string value', expected: 'string value' },
      { received: true, expected: 'true' },
      { received: 10, expected: '10' },
      { received: 10, expected: '10' },
      { received: { value: 'value' }, expected: '{"value":"value"}' },
      { received: date, expected: date.toString() },
    ]

    arrange.forEach(({ received, expected }) => {
      const vo = new StubValueObject(received);
      expect(`${vo}`).toBe(expected);
    })
  });

  it('freeze value', () => {
    const vo = new StubValueObject({teste: true});
    expect(() => vo['value'].teste = 'teste').toThrowError(TypeError);
  });
})