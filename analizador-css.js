const fs = require('fs');
const path = require('path');
const { glob } = require('glob');

// Directorio raíz del proyecto
const rootDir = path.join(__dirname);

// Patrones de búsqueda
const htmlFiles = glob.sync('**/*.html', { cwd: rootDir, ignore: 'node_modules/**' });
const cssFile = path.join(rootDir, 'css/estilos.css');

// Leer el archivo CSS
const cssContent = fs.readFileSync(cssFile, 'utf-8');

// Extraer selectores CSS
const selectorRegex = /([^{}]+)\s*{/g;
let match;
const selectors = new Set();

while ((match = selectorRegex.exec(cssContent)) !== null) {
  const selector = match[1].trim();
  // Filtrar solo selectores de clase e ID
  if (selector.includes('.') || selector.includes('#')) {
    selectors.add(selector);
  }
}

// Analizar archivos HTML en busca de los selectores
const usedSelectors = new Set();

htmlFiles.forEach(file => {
  const filePath = path.join(rootDir, file);
  const htmlContent = fs.readFileSync(filePath, 'utf-8');
  
  selectors.forEach(selector => {
    const simpleSelectors = selector.split(',').map(s => s.trim());
    
    simpleSelectors.forEach(simpleSelector => {
      // Extraer solo el nombre de la clase o ID
      const classMatch = simpleSelector.match(/\.([a-zA-Z0-9_-]+)/g);
      const idMatch = simpleSelector.match(/#([a-zA-Z0-9_-]+)/g);
      
      if (classMatch) {
        classMatch.forEach(cls => {
          if (htmlContent.includes(cls.replace('.', 'class="'))) {
            usedSelectors.add(simpleSelector);
          }
        });
      }
      
      if (idMatch) {
        idMatch.forEach(id => {
          if (htmlContent.includes(id.replace('#', 'id="'))) {
            usedSelectors.add(simpleSelector);
          }
        });
      }
    });
  });
});

// Identificar selectores no utilizados
const unusedSelectors = new Set([...selectors].filter(x => !usedSelectors.has(x)));

console.log('=== Selectores CSS no utilizados ===');
console.log(Array.from(unusedSelectors).join('\n'));
console.log('\nTotal de selectores no utilizados:', unusedSelectors.size);

// Opcional: Generar un archivo con los estilos no utilizados
const unusedCss = Array.from(unusedSelectors)
  .map(selector => `${selector} {\n  /* Sin uso */\n}`)
  .join('\n\n');

fs.writeFileSync('unused-styles.css', unusedCss);
console.log('\nSe ha generado el archivo unused-styles.css con los estilos no utilizados.');
