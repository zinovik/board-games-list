import fs from 'fs/promises';
import path from 'path';

const CSV_URL =
  'https://storage.googleapis.com/board-games-list/bgg_collection.csv';

const OUTPUT_DIR = './public/images';

// BGG XML API2: max 20 ids per `thing` request, ~5s between requests to
// avoid 500/503 throttling.
const BATCH_SIZE = 20;
const REQUEST_DELAY_MS = 5000;

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

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const decodeXmlEntities = (str) =>
  str
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&amp;/g, '&');

// Pulls id -> thumbnail URL out of a /xmlapi2/thing response.
//
// BGG provides both:
//   <thumbnail>...</thumbnail>  -> smaller preview image
//   <image>...</image>          -> full-size image
//
// We use the thumbnail to keep the downloaded files much smaller.
export const parseThingImages = (xml) => {
  const results = new Map();

  const itemRegex = /<item\s+[^>]*\bid="(\d+)"[^>]*>([\s\S]*?)<\/item>/g;

  let match;

  while ((match = itemRegex.exec(xml)) !== null) {
    const [, id, body] = match;

    const thumbnailMatch = body.match(/<thumbnail>([\s\S]*?)<\/thumbnail>/);

    const imageMatch = body.match(/<image>([\s\S]*?)<\/image>/);

    // Prefer the thumbnail. Fall back to the full image if no
    // thumbnail is available.
    const imageUrl = thumbnailMatch?.[1]
      ? decodeXmlEntities(thumbnailMatch[1].trim())
      : imageMatch?.[1]
        ? decodeXmlEntities(imageMatch[1].trim())
        : null;

    results.set(id, imageUrl);
  }

  return results;
};

const fetchImageUrls = async (ids, attempt = 1) => {
  const url = `https://boardgamegeek.com/xmlapi2/thing?id=${ids.join(',')}`;

  const headers = {
    Authorization: `Bearer ${process.env.BGG_API_TOKEN}`,
  };

  const res = await fetch(url, { headers });

  if ([429, 500, 502, 503, 504].includes(res.status)) {
    if (attempt >= 5) {
      throw new Error(
        `Gave up after ${attempt} attempts (status ${res.status})`,
      );
    }

    const backoff = REQUEST_DELAY_MS * attempt;

    console.log(
      `Throttled (status ${res.status}), retrying in ${backoff / 1000}s...`,
    );

    await sleep(backoff);
    return fetchImageUrls(ids, attempt + 1);
  }

  if (res.status === 401 || res.status === 403) {
    throw new Error(
      `BGG API rejected the request (status ${res.status}). ` +
        'Register an app and set BGG_API_TOKEN.',
    );
  }

  if (!res.ok) {
    throw new Error(`BGG API request failed: ${res.status}`);
  }

  const xml = await res.text();

  return parseThingImages(xml);
};

const downloadImage = async (url, dest) => {
  const res = await fetch(url);

  if (!res.ok) {
    throw new Error(`Failed image download: ${res.status}`);
  }

  const buffer = Buffer.from(await res.arrayBuffer());

  await fs.writeFile(dest, buffer);
};

const main = async () => {
  await fs.mkdir(OUTPUT_DIR, { recursive: true });

  console.log('Downloading CSV...');

  const res = await fetch(CSV_URL);

  if (!res.ok) {
    throw new Error(`Failed to fetch CSV: ${res.status}`);
  }

  const csvText = await res.text();

  const allIds = parseCsv(csvText)
    .slice(1)
    .map((line) => line[1]?.trim())
    .filter(Boolean);

  console.log(`Found ${allIds.length} IDs`);

  const pending = [];

  for (const id of allIds) {
    const outputPath = path.join(OUTPUT_DIR, `${id}.jpg`);

    if (!(await fileExists(outputPath))) {
      pending.push(id);
    }
  }

  console.log(`${pending.length} images left to download`);

  for (let i = 0; i < pending.length; i += BATCH_SIZE) {
    const batch = pending.slice(i, i + BATCH_SIZE);

    console.log(
      `Batch ${i / BATCH_SIZE + 1}: ids ${
        batch[0]
      }..${batch[batch.length - 1]}`,
    );

    try {
      const imageUrls = await fetchImageUrls(batch);

      for (const id of batch) {
        const imageUrl = imageUrls.get(id);
        const outputPath = path.join(OUTPUT_DIR, `${id}.jpg`);

        if (!imageUrl) {
          console.log(`No image found for ${id}`);
          continue;
        }

        try {
          await downloadImage(imageUrl, outputPath);
          console.log(`Saved ${outputPath}`);
        } catch (err) {
          console.error(`Failed to download image for ${id}:`, err.message);
        }
      }
    } catch (err) {
      console.error(`Failed batch starting at ${batch[0]}:`, err.message);
    }

    if (i + BATCH_SIZE < pending.length) {
      await sleep(REQUEST_DELAY_MS);
    }
  }
};

main().catch(console.error);
