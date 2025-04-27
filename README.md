# Recipe Repository

A collection of recipes with ingredient-based search.

## Search Recipes by Ingredients

<input type="text" id="ingredientSearch" onkeyup="searchRecipes()" placeholder="Enter ingredients (e.g., chicken, garlic)">
<ul id="searchResults"></ul>

<script>
  let index;
  let recipeData = {};

  // Load the index and recipe data
  fetch('index.json')
    .then(response => response.json())
    .then(data => {
      index = lunr.Index.load(data);
      return fetch('./recipes')
        .then(response => response.text())
        .then(data => {
          const parser = new DOMParser();
          const html = parser.parseFromString(data, 'text/html');
          const fileLinks = html.querySelectorAll('a[title$=".md"]');
          const fetchPromises = Array.from(fileLinks).map(link => {
            const fileName = link.getAttribute('title');
            return fetch('./recipes/' + fileName)
              .then(response => response.text())
              .then(recipeContent => {
                const titleMatch = recipeContent.match(/^#\s+(.*)$/m);
                const title = titleMatch ? titleMatch[1].trim() : fileName.replace('.md', '').replace(/-/g, ' ');
                recipeData['./recipes/' + fileName] = { title, content: recipeContent };
              });
          });
          return Promise.all(fetchPromises);
        });
    })
    .catch(error => console.error("Error loading index or recipes:", error));

  function searchRecipes() {
    const input = document.getElementById('ingredientSearch');
    const filter = input.value.toLowerCase();
    const searchResultsList = document.getElementById('searchResults');
    searchResultsList.innerHTML = ""; // Clear previous results

    if (!index) {
      const listItem = document.createElement('li');
      listItem.textContent = "Loading recipes...";
      searchResultsList.appendChild(listItem);
      return;
    }

    const results = index.search(filter);

    if (results.length === 0) {
      const listItem = document.createElement('li');
      listItem.textContent = "No recipes found matching your ingredients.";
      searchResultsList.appendChild(listItem);
      return;
    }

    results.forEach(result => {
      const recipeInfo = recipeData[result.ref];
      if (recipeInfo) {
        const listItem = document.createElement('li');
        const recipeLink = document.createElement('a');
        recipeLink.href = result.ref;
        recipeLink.textContent = recipeInfo.title;
        listItem.appendChild(recipeLink);
        searchResultsList.appendChild(listItem);
      }
    });
  }
</script>

## Adding or Updating Recipes

To add new recipes or update existing ones:

1.  **Create or modify recipe files** in the `recipes/` directory. Each recipe should be a Markdown file (`.md`). Follow the format used in the existing files (e.g., include an "Ingredients" section).
2.  **Stage your changes:**
    ```bash
    git add recipes/your-new-recipe.md
    git add recipes/your-modified-recipe.md
    ```
    or
    ```bash
    git add .
    ```
3.  **Commit your changes:**
    ```bash
    git commit -m "Add new recipe: Your New Recipe Name"
    ```
    or
    ```bash
    git commit -m "Update recipe: Your Modified Recipe Name"
    ```
    or
    ```bash
    git commit -m "Describe your changes here"
    ```
4.  **Push your changes to GitHub:**
    ```bash
    git push origin main
    ```

    *(Assuming your main branch is named `main`. If it's `master`, use `git push origin master`)*

Once you push your changes, the GitHub Actions workflow will automatically run and update the `index.json` file. The search functionality will then reflect the new or updated recipes.