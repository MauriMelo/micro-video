import { Category, CategoryProperties } from "./category";
import { omit } from 'lodash';
import UniqueEntityId from "../../../@seedwork/domain/value-objects/unique-entity-id.vo";

describe('Category Unit Tests', () => {
  beforeEach(() => {
    Category.validate = jest.fn();
  });
  it('constructor of category', () => {
    Category.validate = jest.fn();
    
    //Arrange
    let props : CategoryProperties = {
      name: "Movie",
    }
    // Act
    let category = new Category(props);

    // Assert
    expect(Category.validate).toBeCalled();
    expect(omit(category.props, 'created_at')).toStrictEqual({
      name: "Movie",
      description: null,
      is_active: true,
    });
    expect(category.props.created_at).toBeInstanceOf(Date);

    props = {
      name: 'Movie',
      description: 'some description',
      is_active: false,
      created_at: new Date()
    }
    category = new Category(props);
    expect(category.props).toStrictEqual(props)

    category = new Category({
      name: 'Movie',
      description: 'some description'
    });
    expect(category.props).toMatchObject({
      name: 'Movie',
      description: 'some description'
    })

    category = new Category({
      name: 'Movie',
      is_active: true
    });
    expect(category.props).toMatchObject({
      name: 'Movie',
      is_active: true
    })

    const created_at = new Date();
    category = new Category({
      name: 'Movie',
      created_at
    });
    expect(category.props).toMatchObject({
      name: 'Movie',
      created_at
    })
  });

  it ('id field', () => {
    let category = new Category({
      name: 'Movie'
    });
    expect(category.id).not.toBeNull();

    category = new Category({
      name: 'Movie'
    }, null);
    expect(category.id).not.toBeNull();

    category = new Category({
      name: 'Movie'
    }, new UniqueEntityId());
    expect(category.id).not.toBeNull();
    expect(category.uniqueEntityId).toBeInstanceOf(UniqueEntityId);
  });

  it('getter of name field', () => {
    const category = new Category({
      name: 'Movie'
    });
    expect(category.name).toBe('Movie')
  });

  it('getter and setter of description field', () => {
    let category = new Category({
      name: 'Movie',
    });
    expect(category.description).toBe(null);

    category = new Category({
      name: 'Movie',
      description: 'some description'
    });
    expect(category.description).toBe('some description');
  });

  it('getter and setter of is_active field', () => {
    let category = new Category({
      name: 'Movie',
    });

    expect(category.is_active).toBe(true);

    category = new Category({
      name: 'Movie',
      is_active: false
    });

    expect(category.is_active).toBe(false);
  });

  it('getter and setter of created_at field', () => {
    let category = new Category({
      name: 'Movie',
    });
    
    expect(category.created_at).toBeInstanceOf(Date);
    
    const created_at = new Date();
    category = new Category({
      name: 'Movie',
      created_at
    });

    expect(category.created_at).toBe(created_at);
  });

  it('should set name and description props when update category', () => {
    const category = new Category({
      name: 'Name',
      description: 'same description'
    });
    expect(category.props.name).toBe('Name');
    expect(category.props.description).toBe('same description');

    category.update('new name', 'update description');

    expect(Category.validate).toBeCalledTimes(2);
    expect(category.name).toBe('new name');
    expect(category.description).toBe('update description');
  });
  it('should set prop is_active to false when deactivate category', () => {
    const category = new Category({
      name: 'Name',
      is_active: true
    });
    expect(category.props.is_active).toBe(true);

    category.deactivate()
    expect(category.is_active).toBe(false);
  });

  it('should set prop is_active to true when activate category', () => {
    const category = new Category({
      name: 'Name',
      is_active: false
    });
    expect(category.props.is_active).toBe(false);

    category.activate()
    expect(category.is_active).toBe(true);
  });
});