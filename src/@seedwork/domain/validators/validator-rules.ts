import { ValidationError } from "../errors/validation-error";

export default class ValidatorRules{
  private constructor(private value: any, private property: string) {  }
  static values(value: any, property: string) {
    return new ValidatorRules(value, property);
  }
  
  required() {
    if (this.isInvalid(this.value) || this.value === '') {
      throw new ValidationError(`The ${this.property} is required`);
    }
    return this;
  }

  string () {
    if (this.isInvalid(this.value)) {
      return this;
    }

    if (!this.isString(this.value)) {
      throw new ValidationError(`The ${this.property} must be a string`);
    }
    return this;
  }

  maxLength(max: number) {
    if (this.isInvalid(this.value)) {
      return this;
    }

    if (this.isString(this.value) || this.isArray(this.value)) {
      if (this.value.length > max) {
        throw new ValidationError(`The ${this.property} must be less or equal than ${max} characters`);
      }
    } else {
      throw new ValidationError(`The ${this.property} must be a string or array`);
    }

    return this;
  }

  boolean() {
    if (this.isInvalid(this.value)) {
      return this;
    }
    if (typeof this.value !== 'boolean') {
      throw new ValidationError(`The ${this.property} must be a boolean`);
    }
    return this;
  }

  private isString(value: any) {
    return typeof value === 'string';
  }

  private isArray(value: any) {
    return Array.isArray(value);
  }

  private isInvalid(value: any) {
    return value === null || value === undefined; 
  }

}