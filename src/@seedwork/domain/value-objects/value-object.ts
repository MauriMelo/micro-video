import { InvalidVoError } from "../../errors/invalid-vo.error";
import { deepFreeze } from "../utils/object";

export default abstract class ValueObject<Value = any> {
  protected readonly _value;

  constructor(value: Value) {
    this.validate(value);
    this._value = deepFreeze(value);
  } 
  
  get value() : Value {
    return this._value;
  }

  private validate(value: Value) {
    if (value === undefined || value === null) {
      throw new InvalidVoError();
    }

    return true;
  }

  toString = () => {
    if (typeof this._value !== 'object' || this._value === null) {
      try {
        return this.value.toString();
      } catch (err) {
        return this.value + "";
      }
    }
    const valueStr = this.value.toString();
    if (valueStr === '[object Object]') {
      return JSON.stringify(this.value);
    }

    return valueStr;
  }
}