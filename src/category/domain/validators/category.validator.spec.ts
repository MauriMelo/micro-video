import CategoryValidatorFactory, { CategoryRules, CategoryValidator } from "./category.validator";

describe('CategoryValidator Tests', () => {
  let validator = new CategoryValidator();

  beforeEach(() => {
    validator = CategoryValidatorFactory.create();
  })

  it('invalidation cases for name field', () => {
    let isValid = validator.validate(null);
    expect(isValid).toBeFalsy();
    expect(validator.errors['name']).toStrictEqual([
      'name should not be empty',
      'name must be a string',
      'name must be shorter than or equal to 255 characters'
    ]);

    isValid = validator.validate({ name: '' });
    expect(isValid).toBeFalsy();
    expect(validator.errors['name']).toStrictEqual([
      'name should not be empty',
    ]);

    isValid = validator.validate({ name: 5 as any });
    expect(isValid).toBeFalsy();
    expect(validator.errors['name']).toStrictEqual([
      'name must be a string',
      'name must be shorter than or equal to 255 characters'
    ]);

    isValid = validator.validate({ name: 't'.repeat(256) });
    expect(isValid).toBeFalsy();
    expect(validator.errors['name']).toStrictEqual([
      'name must be shorter than or equal to 255 characters'
    ]);
  });

  it('valid cases for fields', () => {
    const arrange = [
      { name: 'some value' },
      { name: 'some value', description: '' },
      { name: 'some value', description: null as any},
      { name: 'some value', is_active: true },
      { name: 'some value', is_active: false },
      { name: 'some value', created_at: new Date() }
    ]

    arrange.forEach((item) => {
      const isValid = validator.validate(item);
      expect(isValid).toBeTruthy();
      expect(validator.validatedData).toStrictEqual(new CategoryRules(item));
    });
  });
});