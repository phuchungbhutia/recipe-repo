const fs = require('fs');
const path = require('path');

const recipesDir = path.join(__dirname, '..', 'recipes');
const outputPath = path.join(__dirname, '..', 'recipes.json');

function extractMetadata(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split('\n');

  let title = '';
  let ingredients = [];
  let inIngredients = false;

  for (let line of lines) {
    if (line.startsWith('# ')) {
      title = line.replace('# ', '').trim();
    } else if (line.trim().toLowerCase().startsWith('## ingredients')) {
      inIngredients = true;
    } else if (inIngredients) {
      if (line.startsWith('##')) break; // next section
      if (line.trim()) ingredients.push(line.trim());
    }
  }

  return {
    title,
    ingredients: ingredients.join('\n'),
    file: './recipes/' + path.basename(filePath).replace(/\\/g, '/')
  };
}

function generateJSON() {
  const files = fs.readdirSync(recipesDir).filter(f => f.endsWith('.md'));
  const recipes = files.map(f => extractMetadata(path.join(recipesDir, f)));

  fs.writeFileSync(outputPath, JSON.stringify(recipes, null, 2), 'utf-8');
  console.log(`✅ recipes.json generated with ${recipes.length} recipes.`);
}

generateJSON();
