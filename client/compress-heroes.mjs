import sharp from 'sharp';
import { readdir, stat } from 'fs/promises';
import { join, extname, basename } from 'path';

const assetsDir = './src/assets';
const files = ['hero.webp', 'hero1.webp', 'hero2.webp', 'hero3.webp', 'hero4.webp'];

async function compress() {
  for (const file of files) {
    const input = join(assetsDir, file);
    const name = basename(file, extname(file));
    const output = join(assetsDir, name + '-opt.webp');

    try {
      const before = (await stat(input)).size;
      // Skip if already small (already optimized)
      if (before < 500 * 1024) {
        console.log(`${file}: already small (${(before/1024).toFixed(0)}KB), skipping`);
        continue;
      }
      await sharp(input)
        .resize(2000, 1125, { fit: 'cover', position: 'center' })
        .webp({ quality: 72, effort: 6, smartSubsample: true })
        .toFile(output);

      const after = (await stat(output)).size;
      console.log(`${file}: ${(before/1024/1024).toFixed(1)}MB → ${(after/1024/1024).toFixed(1)}MB (${Math.round((1-after/before)*100)}% saved) → ${name}-opt.webp`);
    } catch (e) {
      console.error(`Failed ${file}:`, e.message);
    }
  }
  console.log('\nDone! Update Hero.jsx imports to use -opt.webp files, then: npm run build');
}

compress();
