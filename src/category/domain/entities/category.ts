import Entity from '../../../@seedwork/domain/entity/entity';
import UniqueEntityId from '../../../@seedwork/domain/value-objects/unique-entity-id.vo';

export type CategoryProperties = {
  name:string,
  created_at?: Date,
  is_active?:boolean,
  description?:string,
}

export class Category extends Entity<CategoryProperties> {
  constructor(readonly props: CategoryProperties, id?: UniqueEntityId) {
    super(props, id);
    this.props.description = props.description ?? null;
    this.props.is_active = props.is_active ?? true;
    this.props.created_at = props.created_at ?? new Date();
  }

  update(name: string, description: string) {
    this.props.name = name;
    this.props.description = description ?? null;
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


 
