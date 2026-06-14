// Sample Input - npm run createBlog --name=InstagramCLI --title='InstagramCLI' ..... Use this to make new project

const { execSync } = require('child_process');
const fs = require('fs');

const n = process.env.npm_config_name;
const t = process.env.npm_config_title;

if (!n) {
  console.error('Please provide a project name: npm run createBlog --name=MyApp --title="My App"');
  process.exit(1);
}

// Convert PascalCase/camelCase to kebab-case  (InstagramCLI → instagram-cli)
const toKebab = str => str
  .replace(/([a-z])([A-Z])/g, '$1-$2')
  .replace(/([A-Z]+)([A-Z][a-z])/g, '$1-$2')
  .toLowerCase();

const kebab = toKebab(n);  // instagram-cli
const className = n;       // InstagramCLI (keep as-is, user passes PascalCase)

// 1. Generate Angular component
execSync(`ng g c components/blogs/${n} --skip-tests`, { stdio: 'inherit' });

// 2. Create public folder
const dir = `public/blogs/${kebab}`;
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir, { recursive: true });
  console.log('Created folder: ' + dir);
}

// 3. Add entry to blogs.index.ts
const f = 'src/app/components/blogs/blogs.index.ts';
let c = fs.readFileSync(f, 'utf8');

const entry = `    {
        slug: '${kebab}',
        title: '${t || n}',
        thumbnail: '/blogs/',
        publishedTime: '${new Date().toISOString()}',
        modifiedTime: '${new Date().toISOString()}',
        summary: '',
        loadComponent: () => import('./${kebab}/${kebab}').then(mod => mod.${className})
    }`;

c = c.replace('];', ',\n' + entry + '\n];');
fs.writeFileSync(f, c, 'utf8');
console.log('Added entry to blogs.index.ts');