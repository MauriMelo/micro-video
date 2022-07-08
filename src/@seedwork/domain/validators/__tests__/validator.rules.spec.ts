import { ValidationError } from "../../errors/validation-error";
import ValidatorRules from "../validator-rules"

interface RunRuleProps {
  value: any;
  property: string;
  rule: keyof ValidatorRules;
  params?: any[],
}

function assertIsInvalid({value, property, rule, params = [], error } : RunRuleProps & { error: Error }) {
  expect(() => runRule({value, property, rule, params })).toThrowError(error);
}

function assertIsvalid({value, property, rule, params, error } : RunRuleProps & { error: Error }) {
  expect(() => runRule({value, property, rule, params })).not.toThrowError(error);
}

function runRule({value, property, rule, params = [] } : RunRuleProps) {
  const validator = ValidatorRules.values(value, property);
  const method = validator[rule];
  method.apply(validator, params)
}

describe('ValidatorRules Unit Test', () => {
  test('values method', () => {
    const validator = ValidatorRules.values('same value', 'field');
    expect(validator['value']).toBe('same value');
    expect(validator['property']).toBe('field');
    expect(validator).toBeInstanceOf(ValidatorRules);
  });

  test('required validation rule', () => {
    const arrangeInvalid = [
      { value: null, property: 'prop' },
      { value: '', property: 'prop' },
      { value: undefined, property: 'prop' },
    ];
    
    const error = new ValidationError('The prop is required')
     arrangeInvalid.forEach(({ value, property }) => {
      assertIsInvalid({ value, property, rule: 'required', error })
     });

     const arrangeValid = [
      { value: 'string', property: 'prop' },
      { value: 5, property: 'prop' },
      { value: {}, property: 'prop' },
      { value: 0, property: 'prop' },
     ];

     arrangeValid.forEach(({ value, property }) => {
      assertIsvalid({ value, property, rule: 'required', error: new ValidationError('The prop is required') })
     });
  });
  test('string validation rule', () => {
    const arrangeInvalid = [
      { value: 1, property: 'prop' },
      { value: true, property: 'prop' },
      { value: {}, property: 'prop' },
    ];
    
    const error = new ValidationError('The prop must be a string');
     arrangeInvalid.forEach(({ value, property }) => {
      assertIsInvalid({ value, property, rule: 'string', error })
     });

     const arrangeValid = [
      { value: 'string', property: 'prop' },
     ];

     arrangeValid.forEach(({ value, property }) => {
      assertIsvalid({ value, property, rule: 'string', error })
     });
  });

  test('maxLength validation rule', () => {
    const errorMaxlength = new ValidationError('The prop must be less or equal than 5 characters');
    const errorStringOrArray = new ValidationError('The prop must be a string or array');
    const arrangeInvalid = [
      { value: "aaaaaa", property: 'prop', params: [5], error: errorMaxlength },
      { value: "aaaaaa", property: 'prop', params: [5], error: errorMaxlength },
      { value: [1, 2, 3, 4, 5, 6], property: 'prop', params: [5], error: errorMaxlength },
      { value: 0, property: 'prop', params: [5], error: errorStringOrArray },
      { value: true, property: 'prop', params: [5], error: errorStringOrArray },
      { value: {}, property: 'prop', params: [5], error: errorStringOrArray },
    ];
    
     arrangeInvalid.forEach(({ value, property, params, error }) => {
      assertIsInvalid({ value, property, rule: 'maxLength', params, error })
     });

     const arrangeValid = [
      { value: 'aaa', property: 'prop', params: [5], error: errorMaxlength },
      { value: [1, 2, 3], property: 'prop', params: [5], error: errorMaxlength },
     ];

     arrangeValid.forEach(({ value, property, params, error }) => {
      assertIsvalid({ value, property, rule: 'maxLength', params, error })
     });
  });

  test('boolean validation rule', () => {
    const error = new ValidationError('The prop must be a boolean');
    const arrangeInvalid = [
      { value: 'string', property: 'prop', params: [5] },
      { value: 5, property: 'prop', params: [5] },
      { value: {}, property: 'prop', params: [5] },
    ];
    
     arrangeInvalid.forEach(({ value, property, params }) => {
      assertIsInvalid({ value, property, rule: 'boolean', params, error })
     });

     const arrangeValid = [
      { value: true, property: 'prop', params: [5] },
      { value: false, property: 'prop', params: [5] },
     ];

     arrangeValid.forEach(({ value, property, params }) => {
      assertIsvalid({ value, property, rule: 'boolean', params, error })
     });
  });

  it('should throw a validation error when combine two or more validation rules', () => {
    let validator = ValidatorRules.values(null, 'prop');
    expect(() => validator.required().string().maxLength(5)).toThrowError(new ValidationError('The prop is required'));
    
    validator = ValidatorRules.values(5, 'prop');
    expect(() => validator.required().string().maxLength(5)).toThrowError(new ValidationError('The prop must be a string'));

    validator = ValidatorRules.values({}, 'prop');
    expect(() => validator.required().string().maxLength(5)).toThrowError(new ValidationError('The prop must be a string'));

    validator = ValidatorRules.values('123456', 'prop');
    expect(() => validator.required().string().maxLength(5)).toThrowError(new ValidationError('The prop must be less or equal than 5 characters'));

    validator = ValidatorRules.values('string', 'prop');
    expect(() => validator.required().boolean()).toThrowError(new ValidationError('The prop must be a boolean'));
  });

  it('should valid when combine two or more validation rules', () => {
    expect.assertions(0);
    ValidatorRules.values('value', 'prop').string().maxLength(5);
    ValidatorRules.values('value', 'prop').string().maxLength(5);
    ValidatorRules.values('12345', 'prop').string().maxLength(5);
    ValidatorRules.values(true, 'prop').required().boolean();
    ValidatorRules.values(false, 'prop').required().boolean();
  });
})