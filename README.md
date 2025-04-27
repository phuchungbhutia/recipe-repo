# Recipe Repository with Ingredient-Based Search

This repository contains a collection of recipes stored as Markdown files in the `recipes/` directory. Use the search interface to find recipes based on ingredients you have on hand.

## Search Recipes
Visit the [Recipe Search Page](https://phuchungbhutia.github.io/recipe-repo/) to search for recipes by entering ingredients.

## How to Contribute
To add or update a recipe:
1. Create or edit a Markdown file in the `recipes/` directory, following the structure in existing recipes (e.g., `# Title`, `## Ingredients:`, `## Instructions:`).
2. Commit and push your changes:
   ```bash
   git add . 
   git commit -m "Update"
   git push
  ```
  or
   ```bash
   git add recipes/
   git commit -m "Add new recipe"
   git push origin main
  ```
---

## Troubleshooting
If the recipes aren’t listed or other issues occur:

### Push Rejection Persists:
If git pull results in conflicts, share the conflicting files and their contents.
Alternatively, back up your local changes, reset to the remote state, and reapply:

  ```bash
  git fetch origin
  git reset --hard origin/main
  git add index.html
  git commit -m "Update index.html"
  git push origin main
  ```
---
