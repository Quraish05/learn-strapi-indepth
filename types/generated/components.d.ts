import type { Schema, Struct } from '@strapi/strapi';

export interface PlanItemIngredientItem extends Struct.ComponentSchema {
  collectionName: 'components_plan_item_ingredient_items';
  info: {
    displayName: 'ingredient-item';
  };
  attributes: {
    ingredient: Schema.Attribute.Relation<
      'oneToOne',
      'api::ingredient.ingredient'
    >;
    quantity: Schema.Attribute.Decimal;
  };
}

export interface PlanItemRecipeItem extends Struct.ComponentSchema {
  collectionName: 'components_plan_item_recipe_items';
  info: {
    displayName: 'recipe-item';
  };
  attributes: {
    quantity: Schema.Attribute.Decimal;
    recipe: Schema.Attribute.Relation<'oneToOne', 'api::recipe.recipe'>;
    unit: Schema.Attribute.Enumeration<['serving', 'bowl', 'plate']>;
  };
}

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
      'plan-item.ingredient-item': PlanItemIngredientItem;
      'plan-item.recipe-item': PlanItemRecipeItem;
      'shared.ingredient-item': SharedIngredientItem;
    }
  }
}
