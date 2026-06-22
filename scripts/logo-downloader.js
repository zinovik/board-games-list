import fs from 'fs/promises';
import path from 'path';
import chromium from '@sparticuz/chromium';
import puppeteer from 'puppeteer';

const CSV_URL =
  'https://storage.googleapis.com/board-games-list/bgg_collection.csv';

const OUTPUT_DIR = './public/images';

export const parseCsv = (text) => {
  const rows = [];
  let row = [];
  let field = '';
  let inQuotes = false;

  for (let i = 0; i < text.length; i += 1) {
    const char = text[i];
    const nextChar = text[i + 1];

    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        field += '"';
        i += 1;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }

    if (char === ',' && !inQuotes) {
      row.push(field);
      field = '';
      continue;
    }

    if ((char === '\n' || char === '\r') && !inQuotes) {
      if (char === '\r' && nextChar === '\n') {
        i += 1;
      }
      row.push(field);
      field = '';
      rows.push(row);
      row = [];
      continue;
    }

    field += char;
  }

  if (field !== '' || row.length > 0) {
    row.push(field);
    rows.push(row);
  }

  return rows.filter((r) => r.some((cell) => cell.trim().length > 0));
};

const fileExists = async (filePath) => {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
};

const downloadImage = async (url, dest) => {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed image download: ${res.status}`);

  const buffer = Buffer.from(await res.arrayBuffer());
  await fs.writeFile(dest, buffer);
};

const getImageUrl = async (page, id) => {
  const url = `https://boardgamegeek.com/boardgame/${id}`;

  await page.goto(url, {
    waitUntil: 'networkidle2',
    timeout: 30000,
  });

  const html = await page.content();

  const imageUrl = html.match(/"imageurl":"(https:\\\/\\\/[^"]+)"/);

  if (!imageUrl) return null;

  return imageUrl[1].replace(/\\\//g, '/');
};

const main = async () => {
  await fs.mkdir(OUTPUT_DIR, { recursive: true });

  console.log('Downloading CSV...');
  const res = await fetch(CSV_URL);
  if (!res.ok) throw new Error(`Failed to fetch CSV: ${res.status}`);
  const csvText = await res.text();

  const ids = parseCsv(csvText)
    .slice(1)
    .map((line) => line[1]);
  console.log(`Found ${ids.length} IDs`);

  const browser = await puppeteer.launch({
    args: chromium.args,
    executablePath: await chromium.executablePath(),
    headless: true,
  });

  const page = await browser.newPage();
  await page.setUserAgent(
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  );
  await page.setJavaScriptEnabled(false);
  await page.setRequestInterception(true);
  page.on('request', (req) => {
    if (
      req.resourceType() === 'image' ||
      req.resourceType() === 'stylesheet' ||
      req.resourceType() === 'font'
    ) {
      req.abort();
    } else {
      req.continue();
    }
  });

  for (const id of ids) {
    const outputPath = path.join(OUTPUT_DIR, `${id}.jpg`);

    if (await fileExists(outputPath)) {
      console.log(`Skipping ${id} (already downloaded)`);
      continue;
    }

    try {
      console.log(`Processing ${id}...`);

      const imageUrl = await getImageUrl(page, id);

      if (!imageUrl) {
        console.log(`No image found for ${id}`);
        continue;
      }

      await downloadImage(imageUrl, outputPath);

      console.log(`Saved ${outputPath}`);
    } catch (err) {
      console.error(`Failed for ${id}:`, err.message);
    }
  }

  await browser.close();
};

main().catch(console.error);
