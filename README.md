# Recipe Repository with Ingredient-Based Search

This repository contains a collection of recipes stored as Markdown files in the `recipes/` directory. Use the search interface to find recipes based on ingredients you have on hand.

## Search Recipes
Visit the [Recipe Search Page](https://phuchungbhutia.github.io/recipe-repo/) to search for recipes by entering ingredients.

## How to Contribute
To add or update a recipe:
1. Create or edit a Markdown file in the `recipes/` directory, following the structure in existing recipes (e.g., `# Title`, `## Ingredients:`, `## Instructions:`).
2. Commit and push your changes:
   ```bash
   git add recipes/
   git commit -m "Add new recipe"
   git push origin main

## Search Script
## Search Recipes by Ingredients

<input type="text" id="ingredientSearch" onkeyup="searchRecipes()" placeholder="Enter ingredients (e.g., chicken, garlic)">
<ul id="searchResults"></ul>

<script>
function searchRecipes() {
  const input = document.getElementById("ingredientSearch");
  const filter = input.value.toLowerCase();
  const searchResultsList = document.getElementById("searchResults");
  searchResultsList.innerHTML = ""; // Clear previous results

  fetch('./') // Fetch the list of files in the repository
    .then(response => response.text())
    .then(data => {
      const parser = new DOMParser();
      const html = parser.parseFromString(data, 'text/html');
      const fileLinks = html.querySelectorAll('a[title$=".md"]'); // Adjust if you use a different file extension

      fileLinks.forEach(link => {
        const fileName = link.getAttribute('title');
        fetch(fileName) // Fetch the content of each recipe file
          .then(response => response.text())
          .then(recipeContent => {
            if (recipeContent.toLowerCase().includes(filter)) {
              const listItem = document.createElement('li');
              const recipeLink = document.createElement('a');
              recipeLink.href = fileName;
              recipeLink.textContent = fileName.replace('.md', '').replace(/-/g, ' '); // Display a nicer name
              listItem.appendChild(recipeLink);
              searchResultsList.appendChild(listItem);
            }
          });
      });
    });
}
</script>
