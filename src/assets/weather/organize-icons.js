const fs = require('fs');
const path = require('path');

const SOURCE_DIR = path.join(__dirname, 'weather-icons', 'production');
const DEST_DIR = __dirname;

// Icon style mappings
const STYLES = ['fill', 'line', 'monochrome'];

// Create directories if they don't exist
STYLES.forEach(style => {
  ['static', 'animated'].forEach(type => {
    const dir = path.join(DEST_DIR, type, style);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });
});

// Copy static SVG files
STYLES.forEach(style => {
  const sourceDir = path.join(SOURCE_DIR, style, 'svg-static');
  const destDir = path.join(DEST_DIR, 'static', style);

  if (fs.existsSync(sourceDir)) {
    const files = fs.readdirSync(sourceDir);
    files.forEach(file => {
      if (file.endsWith('.svg')) {
        fs.copyFileSync(
          path.join(sourceDir, file),
          path.join(destDir, file)
        );
      }
    });
  }
});

// Copy animated Lottie files
STYLES.forEach(style => {
  const sourceDir = path.join(SOURCE_DIR, style, 'lottie');
  const destDir = path.join(DEST_DIR, 'animated', style);

  if (fs.existsSync(sourceDir)) {
    const files = fs.readdirSync(sourceDir);
    files.forEach(file => {
      if (file.endsWith('.json')) {
        fs.copyFileSync(
          path.join(sourceDir, file),
          path.join(destDir, file)
        );
      }
    });
  }
});

// Create index.ts file
const indexContent = `export type WeatherIconStyle = 'fill' | 'line' | 'monochrome';
export type WeatherIconType = 'static' | 'animated';

export const getWeatherIconPath = (
  name: string,
  style: WeatherIconStyle = 'fill',
  type: WeatherIconType = 'static'
): string => {
  const extension = type === 'static' ? 'svg' : 'json';
  return \`\${type}/\${style}/\${name}.\${extension}\`;
};
`;

fs.writeFileSync(path.join(DEST_DIR, 'index.ts'), indexContent);

console.log('Weather icons organized successfully!');
