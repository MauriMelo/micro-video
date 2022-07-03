import { deepFreeze } from "./object";

describe('Object Unit Tests', () => {
  it('should not freeze not object values', () => {
    let Strvalue = deepFreeze('a');
    expect(typeof Strvalue).toEqual('string');

    let Booleanvalue = deepFreeze(true);
    expect(typeof Booleanvalue).toEqual('boolean');

    let numberValue = deepFreeze(10);
    expect(typeof numberValue).toEqual('number');

    let dateValue = deepFreeze(new Date());
    expect(dateValue).toBeInstanceOf(Date);
  });

  it('should freeze object values', () => {
    let objValue = deepFreeze({ test: true });
    expect(() => (objValue as any).test = false).toThrowError("Cannot assign to read only property 'test' of object '#<Object>'");
    expect(objValue.test).toBe(true);

    let objValueDeep = deepFreeze({ test: true, deep: { deepProp: new Date() } });
    expect(() => (objValueDeep as any).deep.deepProp = false).toThrowError("Cannot assign to read only property 'deepProp' of object '#<Object>'");
    expect(objValueDeep.deep.deepProp).toBeInstanceOf(Date);
  });
})