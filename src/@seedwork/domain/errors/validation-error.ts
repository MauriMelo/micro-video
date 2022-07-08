import { FieldErrors } from "../validators/validator-fields-interface";

export class ValidationError extends Error {}

export class EntityValidationError extends Error {
  constructor(public errors: FieldErrors) {
    super('Entity Validaton Error');
    this.name = 'EntityValidationError';
  }
}