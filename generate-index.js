const fs = require('fs');
const path = require('path');
const lunr = require('lunr');
const markdownIt = require('markdown-it');

// Directory containing recipe files
const recipesDir = path.join(__dirname, 'recipes');

// Read all recipe files from the directory
const recipeFiles = fs.readdirSync(recipesDir).filter(file => file.endsWith('.md'));

// Parse recipes and create an index
const md = new markdownIt();
let recipes = [];

// Extract content from each Markdown file
recipeFiles.forEach(file => {
  const filePath = path.join(recipesDir, file);
  const content = fs.readFileSync(filePath, 'utf8');
  const parsedContent = md.render(content);

  // Extract title (first line) and ingredients section
  const titleMatch = content.match(/^# (.+)/m);
  const ingredientsMatch = content.match(/## Ingredients:([\s\S]*?)##/m);

  const title = titleMatch ? titleMatch[1] : 'Untitled Recipe';
  const ingredients = ingredientsMatch ? ingredientsMatch[1].trim() : '';

  recipes.push({
    id: file,
    title: title,
    ingredients: ingredients,
    content: content
  });
});

// Create the Lunr.js index
const idx = lunr(function () {
  this.ref('id');
  this.field('title');
  this.field('ingredients');
  this.field('content');

  recipes.forEach(recipe => this.add(recipe));
});

// Save the index to a JSON file
const indexFilePath = path.join(__dirname, 'index.json');
fs.writeFileSync(indexFilePath, JSON.stringify(idx));

console.log('Index generated and saved to index.json');
//npm install lunr markdown-it
