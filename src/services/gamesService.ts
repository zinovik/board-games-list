import { parseCsv } from './parseCsv';
import { Cities, type Game } from '../types';
import type { CsvRow } from './CsvRow';

const COLLECTION_URL =
  'https://storage.googleapis.com/board-games-list/bgg_collection.csv';

const DIGITAL_GAMES_URL =
  'https://storage.googleapis.com/digital-board-games/digital-board-games.json';

export const fetchGames = async (): Promise<Game[]> => {
  const [responseCollection, responseDigital] = await Promise.all([
    fetch(COLLECTION_URL),
    fetch(DIGITAL_GAMES_URL),
  ]);

  const [csvText, digitalGamesText] = await Promise.all([
    responseCollection.text(),
    responseDigital.text(),
  ]);

  const digitalGames: Record<string, string[]> = JSON.parse(digitalGamesText);

  const rows = parseCsv(csvText);
  const headers = rows[0].map((header) => header.trim()) as (keyof CsvRow)[];

  const cswRows = rows.slice(1).map((row) => {
    const cswRow: CsvRow = {} as CsvRow;

    headers.forEach((header, index) => {
      cswRow[header] = row[index]?.trim() ?? '';
    });

    return cswRow;
  });

  return cswRows.map((cswRow) => {
    const [version, ...protectors] = cswRow.comment.split('\n');
    const bestPlayersArray = cswRow.bggbestplayers.split(',').map(Number);

    const digitalGameUrls = digitalGames[cswRow.objectname] ?? [];

    console.log(digitalGameUrls.find((url) => url.includes('boardgamearena')));

    return {
      name: cswRow.objectname,
      year: Number(cswRow.yearpublished),
      id: Number(cswRow.objectid),
      ownedCity:
        cswRow.own === '1'
          ? cswRow.prevowned === '1'
            ? Cities.Warszawa
            : Cities.Brest
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
      boardGameArena: digitalGameUrls.find((url) =>
        url.includes('boardgamearena'),
      ),
      yucata: digitalGameUrls.find((url) => url.includes('yucata')),
    };
  });
};
