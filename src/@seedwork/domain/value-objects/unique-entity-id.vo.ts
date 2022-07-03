import InvalidUuidError from '../../errors/invalid-uuid.error';
import { v4 as uuidv4, validate } from 'uuid';
import ValueObject from './value-object';

export default class UniqueEntityId  extends ValueObject<string> {
  constructor(readonly id?: string) {
    super(id || uuidv4());
    this.validateId();
  }

  private validateId() {
    const isValid = validate(this.value);
    if (!isValid) {
      throw new InvalidUuidError();
    }
  }
}