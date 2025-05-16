const fs = require('fs');
const path = require('path');

const recipesDir = path.join(__dirname, 'recipes'); // now relative to root
const outputPath = path.join(__dirname, 'recipes.json');

function extractMetadata(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split('\n');

  let title = '';
  let ingredients = [];
  let inIngredientsSection = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    // Get title
    if (!title && line.startsWith('# ')) {
      title = line.replace('# ', '').trim();
      continue;
    }

    // Start of Ingredients section
    if (line.toLowerCase() === '## ingredients:' || line.toLowerCase() === '## ingredients') {
      inIngredientsSection = true;
      continue;
    }

    // End of Ingredients section
    if (inIngredientsSection && line.startsWith('##') && !line.toLowerCase().startsWith('## ingredients')) {
      break;
    }

    // Capture ingredient lines
    if (inIngredientsSection && line.startsWith('-')) {
      ingredients.push(line);
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
  const recipes = [];

  for (const file of files) {
    const fullPath = path.join(recipesDir, file);
    try {
      const metadata = extractMetadata(fullPath);
      if (metadata.title && metadata.ingredients) {
        recipes.push(metadata);
      } else {
        console.warn(`⚠️ Skipped ${file} due to missing title or ingredients.`);
      }
    } catch (err) {
      console.error(`❌ Error reading ${file}:`, err.message);
    }
  }

  fs.writeFileSync(output
