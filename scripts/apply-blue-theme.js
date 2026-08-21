const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');

const replacements = [
    // Hex colors
    { from: /#d4af37/gi, to: '#1b64d4' },
    { from: /0xd4af37/gi, to: '0x1b64d4' },
    { from: /#fdcb5b/gi, to: '#1b64d4' },
    { from: /#ecc165/gi, to: '#3b82f6' },
    { from: /0xecc165/gi, to: '0x3b82f6' },
    { from: /#f6e05e/gi, to: '#60a5fa' },
    { from: /#b5942b/gi, to: '#1b64d4' },
    { from: /#795900/gi, to: '#1351b4' },
    { from: /#735500/gi, to: '#1351b4' },
    { from: /#5c4300/gi, to: '#1e40af' },
    { from: /#ffdfa0/gi, to: '#dbeafe' },
    { from: /#261a00/gi, to: '#082f49' },
    
    // RGBA matches
    { from: /212,\s*175,\s*55/g, to: '27, 100, 212' },
    { from: /253,\s*203,\s*91/g, to: '27, 100, 212' },
    { from: /236,\s*193,\s*101/g, to: '59, 130, 246' },

    // Gradient definitions
    { 
        from: /linear-gradient\(135deg,\s*#d4af37,\s*#f6e05e\)/gi, 
        to: 'linear-gradient(135deg, #1b64d4, #60a5fa)' 
    },
    { 
        from: /linear-gradient\(135deg,\s*#1b64d4,\s*#f6e05e\)/gi, 
        to: 'linear-gradient(135deg, #1b64d4, #60a5fa)' 
    }
];

function processDir(dir) {
    const files = fs.readdirSync(dir, { withFileTypes: true });
    for (const file of files) {
        const fullPath = path.join(dir, file.name);
        if (file.isDirectory()) {
            if (file.name !== 'node_modules' && file.name !== '.git') {
                processDir(fullPath);
            }
        } else if (file.isFile() && (file.name.endsWith('.html') || file.name.endsWith('.js') || file.name.endsWith('.css') || file.name.endsWith('.md'))) {
            let content = fs.readFileSync(fullPath, 'utf8');
            let modified = false;
            for (const r of replacements) {
                if (r.from.test(content)) {
                    content = content.replace(r.from, r.to);
                    modified = true;
                }
            }
            if (modified) {
                fs.writeFileSync(fullPath, content, 'utf8');
                console.log(`✓ Updated theme in: ${path.relative(root, fullPath)}`);
            }
        }
    }
}

// Process features, core, and root files
['features', 'core'].forEach(f => {
    const p = path.join(root, f);
    if (fs.existsSync(p)) processDir(p);
});

console.log('🎨 Baldna royal blue theme applied across all files successfully!');
