name: Generate Recipe Index

on:
  push:
    branches:
      - main

jobs:
  build:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout repository
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 18

      - name: Install dependencies
        run: npm install lunr markdown-it

      - name: Generate search index
        run: node generate-index.js

      - name: Commit and push index.json
        run: |
          git config --global phuchungbhutia "github-actions"
          git config --global phuchungbhutia@gmail.com "github-actions@github.com"
          git add index.json
          git commit -m "Update index.json" || echo "No changes to commit"
          git push
