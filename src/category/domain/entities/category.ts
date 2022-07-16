import Entity from '../../../@seedwork/domain/entity/entity';
import UniqueEntityId from '../../../@seedwork/domain/value-objects/unique-entity-id.vo';
import ValidatorRules from '../../../@seedwork/domain/validators/validator-rules';
import CategoryValidatorFactory from '../validators/category.validator';
import { EntityValidationError } from '../../../@seedwork/domain/errors/validation-error';

export type CategoryProperties = {
  name:string,
  created_at?: Date,
  is_active?:boolean,
  description?:string,
}

export class Category extends Entity<CategoryProperties> {
  constructor(readonly props: CategoryProperties, id?: UniqueEntityId) {
    Category.validate(props);
    super(props, id);
    this.props.description = props.description ?? null;
    this.props.is_active = props.is_active ?? true;
    this.props.created_at = props.created_at ?? new Date();
  }

  update(name: string, description?: string) {
    Category.validate({
      name,
      description,
      is_active: this.props.is_active,
    });

    this.props.name = name;
    this.props.description = description ?? null;
  }

  public static validate(props: Omit<CategoryProperties, 'created_at'>) {
    const validator = CategoryValidatorFactory.create();
    const isValid = validator.validate(props);
    if (!isValid) {
      throw new EntityValidationError(validator.errors);
    }
  }

  activate() {
    this.props.is_active = true;
  }

  deactivate() {
    this.props.is_active = false;
  }

  get name() {
    return this.props.name;
  }

  get description() {
    return this.props.description;
  }

  get is_active() {
    return this.props.is_active;
  }

  get created_at() {
    return this.props.created_at;
  }
}


 
