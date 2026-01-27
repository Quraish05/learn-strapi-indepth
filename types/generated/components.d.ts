import type { Schema, Struct } from '@strapi/strapi';

export interface MegaMenuMenuLink extends Struct.ComponentSchema {
  collectionName: 'components_mega_menu_menu_links';
  info: {
    displayName: 'menu-link';
  };
  attributes: {
    customUrl: Schema.Attribute.String;
    ingredient: Schema.Attribute.Relation<
      'oneToOne',
      'api::ingredient.ingredient'
    >;
    linkText: Schema.Attribute.String;
    linkType: Schema.Attribute.Enumeration<
      ['recipe', 'meal-plan', 'meal-slot', 'ingredient', 'custom-url']
    > &
      Schema.Attribute.Required;
    mealPrepPlan: Schema.Attribute.Relation<
      'oneToOne',
      'api::meal-prep-plan.meal-prep-plan'
    >;
    recipe: Schema.Attribute.Relation<'oneToOne', 'api::recipe.recipe'>;
  };
}

export interface MegaMenuMenuSection extends Struct.ComponentSchema {
  collectionName: 'components_mega_menu_menu_sections';
  info: {
    displayName: 'menu-section';
  };
  attributes: {
    menuLinks: Schema.Attribute.Component<'mega-menu.menu-link', true>;
    sectionLabel: Schema.Attribute.String;
    teaserColumn: Schema.Attribute.Component<'mega-menu.menu-teaser', false>;
  };
}

export interface MegaMenuMenuTeaser extends Struct.ComponentSchema {
  collectionName: 'components_mega_menu_menu_teasers';
  info: {
    displayName: 'menu-teaser';
  };
  attributes: {
    image: Schema.Attribute.Media<'images'>;
    recipe: Schema.Attribute.Relation<'oneToOne', 'api::recipe.recipe'>;
    title: Schema.Attribute.String;
  };
}

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
      'mega-menu.menu-link': MegaMenuMenuLink;
      'mega-menu.menu-section': MegaMenuMenuSection;
      'mega-menu.menu-teaser': MegaMenuMenuTeaser;
      'plan-item.ingredient-item': PlanItemIngredientItem;
      'plan-item.recipe-item': PlanItemRecipeItem;
      'shared.ingredient-item': SharedIngredientItem;
    }
  }
}
