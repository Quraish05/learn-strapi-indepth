# Content Model Relations & Connections

This document explains the relationships between Recipe, Ingredients, BaseIngredient, and the Ingredient Item component in our Strapi content model.

## Overview

The content model uses a **component-based approach** to connect recipes with ingredients. This allows recipes to reference base ingredients while adding recipe-specific information like quantity, unit, and price.

## Content Types

### 1. Recipe (`api::recipe.recipe`)

A collection type representing a recipe.

**Attributes:**
- `title` (string) - The name of the recipe
- `ingredientItems` (repeatable component) - Array of ingredient items used in the recipe

### 2. Ingredient / BaseIngredient (`api::ingredient.ingredient`)

A collection type representing a base ingredient. In the frontend, this is often referred to as "BaseIngredient" to distinguish it from the ingredient item component.

**Attributes:**
- `name` (string, required, unique) - The name of the ingredient (e.g., "Tomato", "Flour")
- `slug` (UID, required) - URL-friendly identifier derived from the name
- `description` (blocks) - Rich text description of the ingredient
- `image` (media) - Image of the ingredient

## Components

### Ingredient Item (`shared.ingredient-item`)

A **repeatable component** that connects a recipe to a base ingredient with recipe-specific details.

**Attributes:**
- `quantity` (decimal, required) - Amount needed (e.g., 2.5, 100)
- `unit` (enumeration, required) - Unit of measurement:
  - `g` (grams)
  - `kg` (kilograms)
  - `ml` (milliliters) etc
- ...other fields
- `baseIngredient` (relation, manyToOne) - **Links to `api::ingredient.ingredient`**

## Relationship Diagram

```
Recipe
  │
  └─ ingredientItems[] (repeatable component)
      │
      ├─ Ingredient Item 1
      │   ├─ quantity: 2.5
      │   ├─ unit: "cup"
      │   ├─ price: 3.50
      │   └─ baseIngredient ──→ Ingredient (e.g., "Flour")
      │
      ├─ Ingredient Item 2
          ├─ quantity: 3
          ├─ unit: "pcs"
          └─ baseIngredient ──→ Ingredient (e.g., "Tomato")

```

## How It Works

### Relationship Type: `manyToOne`

The `baseIngredient` relation in the ingredient item component uses a **`manyToOne`** relationship:

- **Many** ingredient items can reference the **same** base ingredient
- Each ingredient item references **one** base ingredient
- This allows reusability: one base ingredient (e.g., "Flour") can be used in multiple recipes with different quantities

### Data Flow

1. **Create Base Ingredients First**
   - Create ingredient entries in Strapi (e.g., "Tomato", "Flour", "Milk")
   - These are reusable across all recipes

2. **Create Recipes with Ingredient Items**
   - When creating a recipe, add ingredient items
   - Each ingredient item:
     - References a base ingredient (via `baseIngredient` relation)
     - Adds recipe-specific data (quantity, unit, price, notes)

3. **Query Structure**
   - When fetching a recipe, you get:
     - Recipe title
     - Array of ingredient items
     - Each ingredient item includes:
       - Quantity, unit, price, notes
       - The full base ingredient object (name, slug, description, image)

## Common Issue & Solution

### The Relation Type Challenge

During initial setup, the `baseIngredient` relation in the `ingredient-item` component was incorrectly configured as `oneToMany` instead of `manyToOne`.

**The Problem:**
- `oneToMany` relation type was set, which means one ingredient item could relate to many base ingredients (returns an array)
- This was incorrect because:
  - One ingredient item should relate to **one** base ingredient
  - Many ingredient items can relate to the **same** base ingredient
- This caused issues when querying data, as the relation would return an array instead of a single object

**The Solution:**
The relation type was changed from `oneToMany` to `manyToOne` in `/src/components/shared/ingredient-item.json`.

**Why `manyToOne` is Correct:**
- **Many** ingredient items can reference the **same** base ingredient
- Each ingredient item references **one** base ingredient (returns a single object)
- This matches the actual data model: one ingredient item → one base ingredient

**Relation Types in Strapi:**
- **`oneToMany`**: One component/entity can relate to many target items (returns array)
- **`manyToOne`**: Many components/entities can relate to one target item (returns single object) ✅ **Correct for our use case**
- **`manyToMany`**: Many components/entities can relate to many target items (returns array)

**Steps to Apply the Fix:**
1. **Restart Strapi** - Schema changes require a restart:
   ```bash
   cd strapi-backend
   npm run develop
   ```

2. **Re-link Ingredients in Admin Panel** (if needed):
   - Go to your Recipe in Strapi Admin
   - Edit the ingredient items
   - Re-select the base ingredient for each item
   - Save and publish

3. **Verify in GraphQL Playground**:
   - Visit http://localhost:1337/graphql
   - Test the query to ensure `baseIngredient` returns a single object, not an array

For more details, see [RELATION_FIX.md](../RELATION_FIX.md).

## Example Usage

### Creating a Recipe

```json
{
  "title": "Chocolate Cake",
  "ingredientItems": [
    {
      "quantity": 2,
      "unit": "cup",
      "price": 2.50,
      "required": true,
      "baseIngredient": { "id": 1 } // References "Flour"
    },
    {
      "quantity": 1,
      "unit": "cup",
      "price": 3.00,
      "required": true,
      "baseIngredient": { "id": 5 } // References "Sugar"
    }
  ]
}
```

### GraphQL Query Example

```graphql
query {
  recipes {
    title
    ingredientItems {
      quantity
      unit
      baseIngredient {
        name
        slug
        description
        image {
          url
        }
      }
    }
  }
}
```

## Key Benefits

1. **Reusability**: Base ingredients are created once and reused across multiple recipes
2. **Flexibility**: Each recipe can specify different quantities and units for the same base ingredient
3. **Data Integrity**: Base ingredient information (name, description, image) is centralized
4. **Recipe-Specific Data**: Quantity, unit, price, and notes are stored per recipe

## Important Notes

- **BaseIngredient** is just a naming convention in the frontend - in Strapi, it's the `Ingredient` collection type
- The `baseIngredient` relation must be `manyToOne` (not `oneToMany`) - see [RELATION_FIX.md](../RELATION_FIX.md) for details
- Components don't have `documentId` in Strapi - they're embedded within the parent entity
- Base ingredients must be created and published before they can be referenced in recipes

