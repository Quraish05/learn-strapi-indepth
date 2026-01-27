# Meal Plan & Meal Slot Content Model

This document explains the Meal Prep Plan and Meal Slot content types, their relationships, and how dynamic zones are used to create flexible meal planning structures.

## Overview

The meal planning system consists of two main content types:
- **Meal Prep Plan**: A weekly meal plan container
- **Meal Slot**: Individual meal entries within a plan

These are connected through a **one-to-many relationship**, where one Meal Prep Plan can contain multiple Meal Slots. Each Meal Slot uses a **dynamic zone** to flexibly store either recipes or individual ingredients.

---

## Content Types

### 1. Meal Prep Plan (`api::meal-prep-plan.meal-prep-plan`)

A **collection type** that represents a weekly meal preparation plan.

**Attributes:**
- `title` (string) - Name of the meal plan
- `weekStartDate` (date) - Starting date of the week for this plan
- `statusOfThePlan` (enumeration) - Current status of the plan:
  - `draft` - Plan is being created/edited
  - `active` - Plan is currently in use
  - `archived` - Plan is completed or no longer active
- `meal_slots` (relation, oneToMany) - Links to multiple Meal Slot entries

**Collection Name:** `meal_prep_plans`

---

### 2. Meal Slot (`api::meal-slot.meal-slot`)

A **collection type** that represents an individual meal within a meal prep plan.

**Attributes:**
- `titleOfMealSlot` (string) - Title/name of this meal slot
- `date` (date) - Specific date for this meal
- `slotType` (enumeration) - Type of meal:
  - `breakfast`
  - `brunch`
  - `lunch`
  - `evening-snack`
  - `dinner`
- `foodOptions` (dynamiczone) - Flexible container for food items (see Dynamic Zones section)
- `meal_prep_plan` (relation, manyToOne) - Links back to the parent Meal Prep Plan

**Collection Name:** `meal_slots`

---

## Relationships

### Meal Prep Plan ↔ Meal Slot

**Relationship Type:** One-to-Many (One Meal Prep Plan → Many Meal Slots)

```
Meal Prep Plan (1) ──────< (Many) Meal Slot
```

**How it works:**
- One Meal Prep Plan can have **multiple** Meal Slots
- Each Meal Slot belongs to **one** Meal Prep Plan
- The relationship is bidirectional:
  - `meal_slots` on Meal Prep Plan (oneToMany, mappedBy: "meal_prep_plan")
  - `meal_prep_plan` on Meal Slot (manyToOne, inversedBy: "meal_slots")

**Example:**
- Meal Prep Plan: "Week of Jan 1, 2024"
  - Meal Slot 1: Breakfast on Jan 1
  - Meal Slot 2: Lunch on Jan 1
  - Meal Slot 3: Dinner on Jan 1
  - Meal Slot 4: Breakfast on Jan 2
  - ... (and so on)

---

## Dynamic Zones

### What is a Dynamic Zone?

A **dynamic zone** is a Strapi feature that allows you to store different types of components in a single field. The content creator can choose which component type to use for each entry, providing flexibility in content structure.

### Food Options Dynamic Zone

The `foodOptions` field in Meal Slot uses a dynamic zone that can contain two different component types:

1. **Recipe Item** (`plan-item.recipe-item`)
2. **Ingredient Item** (`plan-item.ingredient-item`)

This allows meal slots to contain either:
- **Complete recipes** (with quantity and serving units)
- **Individual ingredients** (with quantity only)

---

## Dynamic Zone Components

### 1. Recipe Item Component (`plan-item.recipe-item`)

Used when a meal slot should reference a complete recipe.

**Attributes:**
- `recipe` (relation, oneToOne) - Links to a Recipe content type (`api::recipe.recipe`)
- `quantity` (decimal) - Amount of the recipe (e.g., 1.5, 2.0)
- `unit` (enumeration) - Unit of measurement:
  - `serving` - Number of servings
  - `bowl` - Number of bowls
  - `plate` - Number of plates

**Use Case:** When you want to include a full recipe (e.g., "Chicken Curry - 2 servings")

---

### 2. Ingredient Item Component (`plan-item.ingredient-item`)

Used when a meal slot should reference individual ingredients.

**Attributes:**
- `ingredient` (relation, oneToOne) - Links to an Ingredient content type (`api::ingredient.ingredient`)
- `quantity` (decimal) - Amount of the ingredient needed

**Use Case:** When you want to include raw ingredients (e.g., "Tomatoes - 500g", "Flour - 1kg")

---

## Complete Structure Diagram

### Hierarchical Structure

```
┌─────────────────────────────────────┐
│     Meal Prep Plan                   │
│  ────────────────────────────────   │
│  • title: "Week of Jan 1, 2024"     │
│  • weekStartDate: 2024-01-01        │
│  • statusOfThePlan: "active"        │
│                                      │
│  ┌────────────────────────────────┐ │
│  │  meal_slots (oneToMany)        │ │
│  └────────────────────────────────┘ │
└──────────────┬───────────────────────┘
               │
               │ (1 to Many)
               │
               ▼
    ┌──────────────────────────┐
    │      Meal Slot 1         │
    │  ──────────────────────   │
    │  • titleOfMealSlot        │
    │  • date: 2024-01-01       │
    │  • slotType: "breakfast"  │
    │                          │
    │  ┌──────────────────────┐│
    │  │ foodOptions          ││
    │  │ (dynamiczone)        ││
    │  │                      ││
    │  │ ┌──────────────────┐ ││
    │  │ │ recipe-item      │ ││
    │  │ │ • recipe → Recipe│ ││
    │  │ │ • quantity: 2    │ ││
    │  │ │ • unit: serving │ ││
    │  │ └──────────────────┘ ││
    │  │                      ││
    │  │ ┌──────────────────┐ ││
    │  │ │ ingredient-item  │ ││
    │  │ │ • ingredient →   │ ││
    │  │ │   Ingredient     │ ││
    │  │ │ • quantity: 500  │ ││
    │  │ └──────────────────┘ ││
    │  └──────────────────────┘│
    └──────────────────────────┘
               │
               │ (Many Meal Slots)
               │
               ▼
    ┌──────────────────────────┐
    │      Meal Slot 2         │
    │  • slotType: "lunch"     │
    │  • foodOptions: [...]    │
    └──────────────────────────┘
```

---

## Mind Map: Content Model Structure

```
                    Meal Prep Plan
                    ──────────────
                    │
        ┌───────────┼───────────┐
        │           │           │
    title    weekStartDate  statusOfThePlan
        │           │           │
        │           │           ├─ draft
        │           │           ├─ active
        │           │           └─ archived
        │           │
        └───────────┴───────────┘
                    │
            meal_slots (oneToMany)
                    │
        ┌───────────┴───────────┐
        │                       │
    Meal Slot 1            Meal Slot 2
    ──────────            ──────────
        │                       │
    ┌───┴───┐               ┌───┴───┐
    │       │               │       │
titleOf  date          titleOf  date
MealSlot               MealSlot
    │       │               │       │
    │   slotType            │   slotType
    │   ────────            │   ────────
    │   │                   │   │
    │   ├─ breakfast        │   ├─ breakfast
    │   ├─ brunch           │   ├─ brunch
    │   ├─ lunch            │   ├─ lunch
    │   ├─ evening-snack    │   ├─ evening-snack
    │   └─ dinner           │   └─ dinner
    │                       │
    │   foodOptions         │   foodOptions
    │   (dynamiczone)       │   (dynamiczone)
    │   ─────────────       │   ─────────────
    │   │                   │   │
    │   ├─ recipe-item      │   ├─ recipe-item
    │   │   │               │   │   │
    │   │   ├─ recipe →     │   │   ├─ recipe →
    │   │   │   Recipe      │   │   │   Recipe
    │   │   ├─ quantity     │   │   ├─ quantity
    │   │   └─ unit         │   │   └─ unit
    │   │       │           │   │       │
    │   │       ├─ serving  │   │       ├─ serving
    │   │       ├─ bowl     │   │       ├─ bowl
    │   │       └─ plate    │   │       └─ plate
    │   │                   │   │
    │   └─ ingredient-item  │   └─ ingredient-item
    │       │               │       │
    │       ├─ ingredient → │       ├─ ingredient →
    │       │   Ingredient  │       │   Ingredient
    │       └─ quantity     │       └─ quantity
    │                       │
    └─── meal_prep_plan ────┴─── meal_prep_plan
        (manyToOne)              (manyToOne)
```

---

## Flowchart: Data Flow & Relationships

```
┌─────────────────────────────────────────────────────────────┐
│                    CREATE MEAL PREP PLAN                     │
│                                                              │
│  User creates a new Meal Prep Plan with:                    │
│  • title: "Week of Jan 1, 2024"                            │
│  • weekStartDate: 2024-01-01                               │
│  • statusOfThePlan: "draft"                                │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│                  CREATE MEAL SLOTS                          │
│                                                              │
│  User creates multiple Meal Slots and links them:           │
│  • Each Meal Slot has meal_prep_plan → Meal Prep Plan      │
│  • Meal Prep Plan automatically gets meal_slots array      │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│              CONFIGURE MEAL SLOT DETAILS                     │
│                                                              │
│  For each Meal Slot, user sets:                            │
│  • titleOfMealSlot: "Monday Breakfast"                     │
│  • date: 2024-01-01                                        │
│  • slotType: "breakfast"                                    │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│            ADD FOOD OPTIONS (Dynamic Zone)                   │
│                                                              │
│  User can add multiple food items:                          │
│                                                              │
│  ┌──────────────────────────────────────┐                  │
│  │  Option 1: Add Recipe Item            │                  │
│  │  • Select recipe-item component       │                  │
│  │  • Choose recipe from Recipe list     │                  │
│  │  • Set quantity: 2                    │                  │
│  │  • Set unit: "serving"                │                  │
│  └──────────────────────────────────────┘                  │
│                                                              │
│  ┌──────────────────────────────────────┐                  │
│  │  Option 2: Add Ingredient Item        │                  │
│  │  • Select ingredient-item component   │                  │
│  │  • Choose ingredient from Ingredient  │                  │
│  │    list                                │                  │
│  │  • Set quantity: 500                  │                  │
│  └──────────────────────────────────────┘                  │
│                                                              │
│  User can mix both types in the same meal slot!             │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│                    QUERY STRUCTURE                          │
│                                                              │
│  When querying a Meal Prep Plan:                            │
│                                                              │
│  Meal Prep Plan {                                           │
│    title                                                     │
│    weekStartDate                                             │
│    statusOfThePlan                                           │
│    meal_slots {                                              │
│      titleOfMealSlot                                         │
│      date                                                    │
│      slotType                                                │
│      foodOptions {                                           │
│        __typename  // "ComponentPlanItemRecipeItem"         │
│        ... OR ...                                           │
│        __typename  // "ComponentPlanItemIngredientItem"     │
│        // Fields depend on component type                   │
│      }                                                       │
│    }                                                         │
│  }                                                           │
└─────────────────────────────────────────────────────────────┘
```

---

## Real-World Example

### Example: Complete Meal Prep Plan Structure

```json
{
  "title": "Week of January 1, 2024",
  "weekStartDate": "2024-01-01",
  "statusOfThePlan": "active",
  "meal_slots": [
    {
      "titleOfMealSlot": "Monday Breakfast",
      "date": "2024-01-01",
      "slotType": "breakfast",
      "foodOptions": [
        {
          "__typename": "ComponentPlanItemRecipeItem",
          "recipe": {
            "title": "Scrambled Eggs with Toast"
          },
          "quantity": 2,
          "unit": "serving"
        },
        {
          "__typename": "ComponentPlanItemIngredientItem",
          "ingredient": {
            "name": "Orange Juice"
          },
          "quantity": 500
        }
      ]
    },
    {
      "titleOfMealSlot": "Monday Lunch",
      "date": "2024-01-01",
      "slotType": "lunch",
      "foodOptions": [
        {
          "__typename": "ComponentPlanItemRecipeItem",
          "recipe": {
            "title": "Chicken Salad"
          },
          "quantity": 1,
          "unit": "bowl"
        }
      ]
    }
  ]
}
```

---

## Key Concepts Summary

### 1. **One-to-Many Relationship**
- One Meal Prep Plan → Many Meal Slots
- Each Meal Slot belongs to exactly one Meal Prep Plan
- Bidirectional relationship with `mappedBy` and `inversedBy`

### 2. **Dynamic Zones**
- `foodOptions` field allows flexible content structure
- Can contain multiple entries of different component types
- Content creators choose component type per entry
- Enables mixing recipes and ingredients in the same meal slot

### 3. **Component Relations**
- Recipe Item → Recipe (oneToOne)
- Ingredient Item → Ingredient (oneToOne)
- Both components add quantity information specific to the meal slot

### 4. **Enumeration Fields**
- `statusOfThePlan`: Controls plan lifecycle (draft → active → archived)
- `slotType`: Categorizes meals by time of day
- `unit` (in recipe-item): Defines serving measurement units

---

## Benefits of This Structure

1. **Flexibility**: Dynamic zones allow mixing recipes and ingredients
2. **Reusability**: Recipes and ingredients are separate content types, reusable across plans
3. **Organization**: Clear hierarchy from plan → slots → food items
4. **Scalability**: Easy to add more component types to the dynamic zone in the future
5. **Type Safety**: Enumeration fields ensure data consistency

---

## Common Use Cases

### Use Case 1: Full Recipe Meal
- Add a `recipe-item` component
- Link to a complete recipe
- Specify servings/quantity

### Use Case 2: Simple Ingredient Meal
- Add an `ingredient-item` component
- Link to individual ingredients
- Specify quantities

### Use Case 3: Mixed Meal
- Add both `recipe-item` and `ingredient-item` components
- Combine a main recipe with additional ingredients
- Example: "Chicken Curry (recipe)" + "Extra Rice (ingredient)"

---

## Related Documentation

- [Relations Overview](./RELATIONS.md) - General relationship patterns
- [Relation Fix](./RELATION_FIX.md) - Common relationship issues and solutions
