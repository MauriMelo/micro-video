import { EntityValidationError } from "../errors/validation-error";
import ClassValidatorFields from "../validators/class-validator-fields";
import { FieldErrors } from "../validators/validator-fields-interface";

type Expected = { validator: ClassValidatorFields<any>, data: any } | (() => any);

expect.extend({
  containsErrorMessages(expected: Expected, received: FieldErrors) {
    if (typeof expected === 'function') {
      try {
        expected();
        return isValid();
      } catch(e) {
        const error = e as EntityValidationError;
        return assertContainsErrorsMessages(error.errors, received);
      }

    } else {
      const { validator, data } = expected;
      const validated = validator.validate(data);
  
      if (validated) {
        return isValid();
      }
  
      return assertContainsErrorsMessages(validator.errors, received);
    }
  }
});

function isValid() {
  return {
    pass: false,
    message: () => "The data is valid"
  }
}

function assertContainsErrorsMessages(errors: FieldErrors, received: FieldErrors) {
  const isMath = expect.objectContaining(received).asymmetricMatch(
    errors
  );

  return isMath ? { pass: true, message: () => "" }
    : {
      pass: false,
      message: () => `The validation errors ${JSON.stringify(errors)} not contains ${JSON.stringify(received)}`,
    }
}

