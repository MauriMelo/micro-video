import { Category } from "../../domain/entities/category"
import { CategoryOutputMapper } from "./category-output"

describe('CategoryOutputMapper Unit Tests', () => {
  it('should convert category to CategoryOutput', () => {
    const category = new Category({
      name: 'Movie',
      created_at: new Date(),
      is_active: true,
      description: 'movie description'
    });
    const spyToJSON = jest.spyOn(Category.prototype, 'toJSON');
    const categoryOutput = CategoryOutputMapper.toOutput(category);
    expect(spyToJSON).toHaveBeenCalled();
    expect(categoryOutput).toStrictEqual({
      id: category.id,
      name: 'Movie',
      description: 'movie description',
      is_active: true,
      created_at: category.props.created_at
    });

  })
})