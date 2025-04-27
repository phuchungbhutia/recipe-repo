const fs = require('fs').promises;
const path = require('path');
const lunr = require('lunr');
const MarkdownIt = require('markdown-it')();

async function generateIndex() {
  try {
    const recipesDir = path.join(__dirname, 'recipes');
    const files = await fs.readdir(recipesDir);
    const recipes = [];

    for (const file of files) {
      if (file.endsWith('.md')) {
        const filePath = path.join(recipesDir, file);
        const content = await fs.readFile(filePath, 'utf-8');
        const tokens = MarkdownIt.parse(content, {});
        let title = '';
        let ingredients = '';
        let inIngredientsSection = false;

        for (let i = 0; i < tokens.length; i++) {
          if (tokens[i].type === 'heading_open' && tokens[i].tag === 'h1') {
            title = tokens[i + 1].content;
          }
          if (tokens[i].type === 'heading_open' && tokens[i].tag === 'h2' && tokens[i + 1].content.toLowerCase().includes('ingredients')) {
            inIngredientsSection = true;
            continue;
          }
          if (inIngredientsSection && tokens[i].type === 'bullet_list_open') {
            while (tokens[i] && tokens[i].type !== 'bullet_list_close') {
              if (tokens[i].type === 'inline') {
                ingredients += tokens[i].content + '\n';
              }
              i++;
            }
            inIngredientsSection = false;
          }
        }

        recipes.push({
          id: file,
          title,
          ingredients,
          content: content.replace(/#+ .*\n|[-*] /g, ''),
          path: `recipes/${file}`
        });
      }
    }

    const index = lunr(function () {
      this.ref('id');
      this.field('title');
      this.field('ingredients');
      this.field('content');
      recipes.forEach(recipe => this.add(recipe));
    });

    await fs.writeFile('index.json', JSON.stringify({ index: index.toJSON(), recipes }));
    console.log('Index generated successfully');
  } catch (err) {
    console.error('Error generating index:', err);
    process.exit(1);
  }
}

generateIndex();