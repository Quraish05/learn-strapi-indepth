# Fix for Ingredient Relation Issue

## Problem
The `baseIngredient` relation in the `ingredient-item` component was set to `oneToMany`, but it should be `manyToOne` because:
- One ingredient item relates to one base ingredient
- Many ingredient items can relate to the same base ingredient

## Solution Applied
Changed the relation type in `/src/components/shared/ingredient-item.json` from `oneToMany` to `manyToOne`.

## Steps to Apply the Fix

1. **Restart Strapi** - The schema change requires a restart:
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
   - Test the query:
   ```graphql
   query {
     recipes {
       title
       ingredientItems {
         quantity
         unit
         baseIngredient {
           name
         }
       }
     }
   }
   ```

## Relation Types in Strapi

- **oneToMany**: One component/entity can relate to many target items (returns array)
- **manyToOne**: Many components/entities can relate to one target item (returns single object)
- **manyToMany**: Many components/entities can relate to many target items (returns array)

For our use case (one ingredient item → one base ingredient), `manyToOne` is correct.

