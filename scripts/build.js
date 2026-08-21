const fs = require('fs');
const path = require('path');

const root = __dirname ? path.join(__dirname, '..') : process.cwd();
const publicDir = path.join(root, 'public');

if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
}

const itemsToCopy = [
    'features',
    'core',
    'backend',
    'index.html',
    'translations.js',
    'logo.png',
    'vercel.json'
];

itemsToCopy.forEach(item => {
    const src = path.join(root, item);
    const dest = path.join(publicDir, item);
    if (fs.existsSync(src)) {
        fs.cpSync(src, dest, { recursive: true, force: true });
        console.log(`✓ Copied ${item} to public/${item}`);
    }
});

// Also copy legacy folders if present for backward compatibility
for (let i = 1; i <= 21; i++) {
    const legacy = `_${i}`;
    const src = path.join(root, legacy);
    const dest = path.join(publicDir, legacy);
    if (fs.existsSync(src)) {
        fs.cpSync(src, dest, { recursive: true, force: true });
    }
}

console.log('🎉 Production build successfully synchronized to public/');
