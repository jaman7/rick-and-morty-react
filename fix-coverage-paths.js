import fs from 'fs';

const path = './coverage/html/index.html'; // <- poprawiona ścieżka

try {
  let content = fs.readFileSync(path, 'utf-8');
  content = content.replace(/href="(?!http|\.\/)/g, 'href="./').replace(/src="(?!http|\.\/)/g, 'src="./');
  fs.writeFileSync(path, content);
  console.log('✅ index.html paths fixed successfully');
} catch (error) {
  console.error('❌ Failed to fix coverage paths:', error.message);
  process.exit(1);
}
