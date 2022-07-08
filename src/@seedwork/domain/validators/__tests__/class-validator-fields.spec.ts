import ClassValidatorFields from "../class-validator-fields";
import * as libClassValidator from 'class-validator';

class StubClassValidatorFields 
  extends ClassValidatorFields<{ field: string }> {

}

describe('ClassValidatorFields Unit Tests', () => {
  it('should initialize erros and validatedData variables with null ', () => {
    const validator = new StubClassValidatorFields();
    expect(validator.errors).toBeNull();
    expect(validator.validatedData).toBeNull();
  });

  it('should validate with errors', () => {
    const spyValidateSync = jest.spyOn(libClassValidator, 'validateSync');
    spyValidateSync.mockReturnValue([
      { 
        property: 'field',
        constraints: {
          isRequired: 'same error'
        }
      }
    ]);
    const validator = new StubClassValidatorFields();

    expect(validator.validate(null)).toBeFalsy();
    expect(spyValidateSync).toHaveBeenCalled();
    expect(validator.validatedData).toBe(null);
    expect(validator.errors).toStrictEqual({field: ["same error"]});
  });

  it('should validate without errors', () => {
    const spyValidateSync = jest.spyOn(libClassValidator, 'validateSync');
    spyValidateSync.mockReturnValue([]);
    const validator = new StubClassValidatorFields();

    expect(validator.validate(null)).toBeTruthy();
    expect(spyValidateSync).toHaveBeenCalled();
    expect(validator.validatedData).toBe(null);
    expect(validator.errors).toStrictEqual(null);
  });
})