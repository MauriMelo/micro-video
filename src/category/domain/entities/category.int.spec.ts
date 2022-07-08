import { Category } from "./category";

describe('Category Integration Test', () => {
  describe('create method', () => {
    it('should a invalid category using name property', () => {
      expect(() => 
        new Category({ name: null})
      ).containsErrorMessages({
        'name': [
          'name should not be empty', 
          'name must be a string',
          'name must be shorter than or equal to 255 characters'
        ]
      });

      expect(() => 
        new Category({ name: 't'.repeat(256)} as any)
      ).containsErrorMessages({
        'name': [
          'name must be shorter than or equal to 255 characters'
        ]
      });

      expect(() => 
        new Category({ name: 5} as any)
      ).containsErrorMessages({
        'name': [
          'name must be a string',
          'name must be shorter than or equal to 255 characters'
        ]
      });
    });
  
    it('should a invalid category using description property', () => {
      expect(() => 
        new Category({ name: 'Movie', description: 5 as any})
      ).containsErrorMessages({
        'description': [
          'description must be a string'
        ]
      });
    });

    it('should a invalid category using is_active property', () => {
      expect(() => 
        new Category({ name: 'Movie', is_active: 5 as any})
      ).containsErrorMessages({
        'is_active': [
          'is_active must be a boolean value'
        ]
      });
    });

    it('should a invalid category using created_at property', () => {
      expect(() => 
        new Category({ name: 'Movie', created_at: 5 as any})
      ).containsErrorMessages({
        'created_at': [
          'created_at must be a Date instance'
        ]
      });
    });

    it('should a valid category', () => {
      expect.assertions(0);
      new Category({ name: 'Movie'}); // NOSONAR
      new Category({ name: 'Movie', description: 'same description'}); // NOSONAR
      new Category({ name: 'Movie', description: null}); // NOSONAR
      new Category({ name: 'Movie', description: 'same description', is_active: true}); // NOSONAR
      new Category({ name: 'Movie', description: 'same description', is_active: false}); // NOSONAR
    });
  });

  describe('update method', () => {
    it('should a invalid category using property name', () => {
      const category = new Category({ name: 'Movie'});
      expect(() => 
        category.update(null)
      ).containsErrorMessages({
        'name': [
          'name should not be empty', 
          'name must be a string',
          'name must be shorter than or equal to 255 characters'
        ]
      });

      expect(() => 
        category.update('l'.repeat(256))
      ).containsErrorMessages({
        'name': [
          'name must be shorter than or equal to 255 characters', 
        ]
      });

      expect(() => 
        category.update(5 as any)
      ).containsErrorMessages({
        'name': [
          'name must be a string', 
          'name must be shorter than or equal to 255 characters'
        ]
      });
    });

    it('should a invalid category using property description', () => {
      const category = new Category({ name: 'Movie'});
      expect(() => 
        category.update("Movie", 5 as any)
      ).containsErrorMessages({
        'description': [
          'description must be a string', 
        ]
      });
    });

    it('should update valid category', () => {
      expect.assertions(0);
      const category = new Category({ name: 'Movie'});
      category.update('Movie');
      category.update('Movie', 'same description');
    });
  });
});