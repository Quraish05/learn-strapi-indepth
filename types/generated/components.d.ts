import type { Schema, Struct } from '@strapi/strapi';

export interface SharedIngredientItem extends Struct.ComponentSchema {
  collectionName: 'components_shared_ingredient_items';
  info: {
    displayName: 'Ingredient Amount';
  };
  attributes: {
    baseIngredient: Schema.Attribute.Relation<
      'manyToOne',
      'api::ingredient.ingredient'
    >;
    notes: Schema.Attribute.Blocks;
    price: Schema.Attribute.Decimal;
    quantity: Schema.Attribute.Decimal & Schema.Attribute.Required;
    required: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<true>;
    unit: Schema.Attribute.Enumeration<
      ['g', 'kg', 'ml', 'l', 'tsp', 'tbsp', 'cup', 'pcs']
    > &
      Schema.Attribute.Required;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'shared.ingredient-item': SharedIngredientItem;
    }
  }
}
