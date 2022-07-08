export type FieldErrors = {
  [field: string]: string[]
};

export default interface ValidatorFieldsInterface<PropsValidated> {
  errors: FieldErrors;
  validatedData: PropsValidated;
  validate(data: any): boolean;
}