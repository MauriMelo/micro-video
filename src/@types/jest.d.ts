import { FieldErrors } from "@seedwork/domain/validators/validator-fields-interface";

declare global {
  declare namespace jest {
    interface Matchers<R> {
      containsErrorMessages: (received: FieldErrors) => R
    }
  }
}