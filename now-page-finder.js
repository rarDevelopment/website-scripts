import fs from 'fs';
import 'dotenv/config';

const scriptsToRun = [
  {
    name: 'updateRecentGames',
    urlToUse: `https://rardk64-bot-api.com/api/now/backloggd/reviews?limit=5`,
    fileName: `${process.env.DIRECTORYPATH}recent-games.json`,
    allowEmpty: false,
  },
  {
    name: 'updateCurrentGames',
    urlToUse: `https://rardk64-bot-api.com/api/now/backloggd/current?limit=5`,
    fileName: `${process.env.DIRECTORYPATH}current-games.json`,
    allowEmpty: true,
  },
  {
    name: 'updateRecentMovies',
    urlToUse: `https://rardk64-bot-api.com/api/now/letterboxd?limit=5`,
    fileName: `${process.env.DIRECTORYPATH}recent-movies.json`,
    allowEmpty: false,
  },
  {
    name: 'updateCurrentTv',
    urlToUse: `https://rardk64-bot-api.com/api/now/serializd/currentlywatching?limit=5`,
    fileName: `${process.env.DIRECTORYPATH}current-tv.json`,
    allowEmpty: true,
  },
  {
    name: 'updateCurrentBooks',
    urlToUse: `https://rardk64-bot-api.com/api/now/goodreads/currently-reading?limit=5`,
    fileName: `${process.env.DIRECTORYPATH}current-books.json`,
    allowEmpty: true,
  },
  {
    name: 'updateFinishedBooks',
    urlToUse: `https://rardk64-bot-api.com/api/now/goodreads/finished?limit=5`,
    fileName: `${process.env.DIRECTORYPATH}recent-books.json`,
    allowEmpty: false,
  },
  {
    name: 'Update Top Albums (This Month)',
    urlToUse: `https://rardk64-bot-api.com/api/now/lastfm/topalbums?limit=5&period=1month`,
    fileName: `${process.env.DIRECTORYPATH}top-albums.json`,
    allowEmpty: false,
  },
  {
    name: 'Update Top Artists (This Month)',
    urlToUse: `https://rardk64-bot-api.com/api/now/lastfm/topartists?limit=5&period=1month`,
    fileName: `${process.env.DIRECTORYPATH}top-artists.json`,
    allowEmpty: false,
  },
];

async function updateNowJson(scriptName, url, fileName, allowEmpty) {
  try {
    const response = await fetch(url);
    const items = await response.json();
    if (items.length === 0 && !allowEmpty) {
      return;
    }
    fs.writeFileSync(fileName, JSON.stringify(items, '', 2));
  } catch (error) {
    console.error(`${scriptName} failed`, error);
  }
}

scriptsToRun.forEach((script) => {
  updateNowJson(script.name, script.urlToUse, script.fileName, script.allowEmpty);
});

// async function updateRecentGames(url, fileName) {
//   try {
//     const response = await fetch(url);
//     const recentGames = await response.json();
//     if (recentGames.length === 0) {
//       return;
//     }
//     fs.writeFileSync(fileName, JSON.stringify(recentGames, '', 2));
//   } catch (error) {
//     console.error('unable to fetch games data', error);
//   }
// }
