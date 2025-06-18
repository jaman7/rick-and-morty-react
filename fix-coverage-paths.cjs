const fs = require('fs');
const path = require('path');

function getHtmlFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      getHtmlFiles(fullPath, fileList);
    } else if (file.endsWith('.html')) {
      fileList.push(fullPath);
    }
  }
  return fileList;
}

const coverageDir = path.join(__dirname, 'coverage');
const htmlFiles = getHtmlFiles(coverageDir);

for (const filePath of htmlFiles) {
  let html = fs.readFileSync(filePath, 'utf8');

  html = html.replace(/<script\s+src="(.+?)"><\/script>/g, '<script src="$1" type="text/javascript" defer></script>');

  html = html.replace(/(href|src)="\/?(?!http)([^"]+)"/g, '$1="./$2"');

  if (!html.includes('http-equiv="Content-Type"')) {
    html = html.replace(/<meta charset="utf-8">/, `$&\n  <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />`);
  }

  fs.writeFileSync(filePath, html);
  console.log(`Patched ${path.relative(__dirname, filePath)}`);
}

const redirectsFile = path.join(coverageDir, '_redirects');
fs.writeFileSync(redirectsFile, '/index.html 200\n');
console.log('Created _redirects file');
