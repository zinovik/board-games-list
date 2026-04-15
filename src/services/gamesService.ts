interface CsvRow {
  objectname: string;
  objectid: string;
  rating: string;
  numplays: string;
  weight: string;
  own: string;
  fortrade: string;
  want: string;
  wanttobuy: string;
  wanttoplay: string;
  prevowned: string;
  preordered: string;
  wishlist: string;
  wishlistpriority: string;
  wishlistcomment: string;
  comment: string;
  conditiontext: string;
  haspartslist: string;
  wantpartslist: string;
  collid: string;
  baverage: string;
  average: string;
  avgweight: string;
  rank: string;
  numowned: string;
  objecttype: string;
  originalname: string;
  minplayers: string;
  maxplayers: string;
  playingtime: string;
  maxplaytime: string;
  minplaytime: string;
  yearpublished: string;
  bggrecplayers: string;
  bggbestplayers: string;
  bggrecagerange: string;
  bgglanguagedependence: string;
  publisherid: string;
  imageid: string;
  year: string;
  language: string;
  other: string;
  itemtype: string;
  barcode: string;
  pricepaid: string;
  pp_currency: string;
  currvalue: string;
  cv_currency: string;
  acquisitiondate: string;
  acquiredfrom: string;
  quantity: string;
  privatecomment: string;
  invlocation: string;
  invdate: string;
  version_publishers: string;
  version_languages: string;
  version_yearpublished: string;
  version_nickname: string;
}

export interface Game {
  name: string;
  year: number;
  id?: number;
  ownedCity?: 'Brest' | 'Warszawa';
  version?: string;
  protectors?: string;
  isPlayed: boolean;
  isPlayedOnlineOnly: boolean;
  rank?: number;
  maxPlayers: number;
  bestPlayers: number;
  weight: number;
  isExpansion: boolean;
  playingTime: number;
}

const parseCsv = (text: string): string[][] => {
  const rows: string[][] = [];
  let row: string[] = [];
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

export const fetchGames = async (): Promise<Game[]> => {
  const response = await fetch(
    'https://storage.googleapis.com/board-games-list/bgg_collection.csv',
  );

  const csvText = await response.text();

  const rows = parseCsv(csvText);
  const headers = rows[0].map((header) => header.trim()) as (keyof CsvRow)[];

  const cswRows = rows.slice(1).map((row) => {
    const cswRow: CsvRow = {} as CsvRow;

    headers.forEach((header, index) => {
      cswRow[header] = row[index]?.trim() || '';
    });

    return cswRow;
  });

  console.log(cswRows);

  return cswRows.map((cswRow) => {
    const [version, ...protectors] = cswRow.comment.split('\n');
    const bestPlayersArray = cswRow.bggbestplayers.split(',').map(Number);

    return {
      name: cswRow.objectname,
      year: Number(cswRow.yearpublished),
      id: Number(cswRow.objectid),
      ownedCity:
        cswRow.own === '1'
          ? cswRow.prevowned === '1'
            ? 'Warszawa'
            : 'Brest'
          : undefined,
      version: version,
      protectors: protectors.join(', '),
      isPlayed: cswRow.wishlist === '1',
      isPlayedOnlineOnly:
        cswRow.wishlist === '1' && cswRow.wishlistpriority === '3',
      rank: cswRow.rank !== '0' ? Number(cswRow.rank) : undefined,
      maxPlayers: Number(cswRow.maxplayers),
      bestPlayers:
        bestPlayersArray.reduce((a, b) => a + b, 0) / bestPlayersArray.length,
      weight: Math.round(Number(cswRow.avgweight) * 100) / 100,
      isExpansion: cswRow.itemtype !== 'standalone',
      playingTime: Number(cswRow.playingtime),
    };
  });
};
