const fs = require('fs');
const path = require('path');
const lunr = require('lunr');
const MarkdownIt = require('markdown-it');
const md = new MarkdownIt();

// Function to extract ingredients and title from a Markdown file
function extractRecipeData(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const titleMatch = content.match(/^#\s+(.*)$/m); // Get first heading
    const ingredientsMatch = content.match(/Ingredients:\s*\n([\s\S]*?)(?:\n##|\n#|$)/i); // Ingredients until next heading or end
    const instructionsMatch = content.match(/Instructions:\s*\n([\s\S]*?)(?:\n##|\n#|$)/i); // Instructions until next heading or end

    const title = titleMatch ? titleMatch[1].trim() : path.basename(filePath, '.md');
    const ingredients = ingredientsMatch ? ingredientsMatch[1].trim() : '';
    const instructions = instructionsMatch ? instructionsMatch[1].trim() : '';

    return {
      title,
      ingredients,
      instructions,
      content, // Include full content for more robust search
      path: filePath,
    };
  } catch (error) {
    console.error(`Error reading or parsing file: ${filePath}`, error);
    return null;
  }
}

// Get all Markdown files in the recipes directory
function getRecipeFiles(dir) {
  try {
    const files = fs.readdirSync(dir);
    return files.filter(file => path.extname(file) === '.md').map(file => path.join(dir, file));
  } catch (error) {
    console.error(`Error reading directory: ${dir}`, error);
    return [];
  }
}

// Build the Lunr.js index
function buildIndex(recipeData) {
  return lunr(function() {
    this.ref('path');
    this.field('title', { boost: 10 });
    this.field('ingredients');
    this.field('instructions');
    this.field('content'); // Add full content field
    recipeData.forEach(recipe => {
      if (recipe) {
        this.add(recipe);
      }
    });
  });
}

// Main script
const recipeFiles = getRecipeFiles('./recipes');
const recipeData = recipeFiles.map(extractRecipeData).filter(recipe => recipe !== null); // Filter out any null results
const index = buildIndex(recipeData);

// Output the index as JSON
console.log(JSON.stringify(index));

console.log("Starting index generation...");
const recipeFiles = getRecipeFiles('./recipes');
console.log("Found recipe files:", recipeFiles);
const recipeData = recipeFiles.map(extractRecipeData).filter(recipe => recipe !== null);
console.log("Extracted recipe data:", recipeData);
const index = buildIndex(recipeData);
console.log("Generated Lunr index:", index);
console.log(JSON.stringify(index)); // This is the final output