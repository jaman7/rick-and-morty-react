import fs from 'fs';
import path from 'path';
import { globSync } from 'glob';

const indexPath = './coverage/index.html';
const coverageDir = './coverage';

try {
  // 1. Fix href/src paths in index.html
  let content = fs.readFileSync(indexPath, 'utf-8');
  content = content.replace(/href="(?!http|\.\/)/g, 'href="./').replace(/src="(?!http|\.\/)/g, 'src="./');
  fs.writeFileSync(indexPath, content);
  console.log('✅ index.html paths fixed successfully');
} catch (error) {
  console.error('❌ Failed to fix index.html paths:', error.message);
  process.exit(1);
}

// 2. Copy source files for HTML report
try {
  const srcFiles = globSync('src/**/*.{ts,tsx}');
  for (const file of srcFiles) {
    const dest = path.join(coverageDir, file);
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    fs.copyFileSync(file, dest);
  }
  console.log(`✅ ${srcFiles.length} source files copied to coverage/`);
} catch (error) {
  console.error('❌ Failed to copy source files:', error.message);
  process.exit(1);
}

// 3. Add .nojekyll
try {
  fs.writeFileSync(path.join(coverageDir, '.nojekyll'), '');
  console.log('✅ .nojekyll file created');
} catch (error) {
  console.error('❌ Failed to create .nojekyll:', error.message);
  process.exit(1);
}

// 4. Add _redirects (optional but recommended for root `/`)
try {
  const redirectsPath = path.join(coverageDir, '_redirects');
  const redirectsContent = '/ /index.html 200\n';
  fs.writeFileSync(redirectsPath, redirectsContent);
  console.log('✅ _redirects file created');
} catch (error) {
  console.error('❌ Failed to create _redirects:', error.message);
  process.exit(1);
}
