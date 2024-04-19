import fs from 'fs';
import 'dotenv/config';

const apiUrl = process.env.API_URL;
const githubUrl = `https://api.github.com/search/repositories?q=user:rarDevelopment&sort=updated&order=desc&per_page=20`;

const scriptsToRun = [
  {
    name: 'updateRecentGames',
    urlToUse: `${apiUrl}backloggd/reviews`,
    fileName: `${process.env.DIRECTORYPATH}now-recent-games.json`,
    allowEmpty: false,
  },
  {
    name: 'updateCurrentGames',
    urlToUse: `${apiUrl}backloggd/current`,
    fileName: `${process.env.DIRECTORYPATH}now-current-games.json`,
    allowEmpty: true,
  },
  {
    name: 'updateRecentMovies',
    urlToUse: `${apiUrl}letterboxd`,
    fileName: `${process.env.DIRECTORYPATH}now-recent-movies.json`,
    allowEmpty: false,
  },
  {
    name: 'updateCurrentTv',
    urlToUse: `${apiUrl}tvshows/latestshows`,
    fileName: `${process.env.DIRECTORYPATH}now-current-tv.json`,
    allowEmpty: false,
  },
  {
    name: 'updateCurrentBooks',
    urlToUse: `${apiUrl}goodreads/currently-reading`,
    fileName: `${process.env.DIRECTORYPATH}now-current-books.json`,
    allowEmpty: true,
  },
  {
    name: 'updateFinishedBooks',
    urlToUse: `${apiUrl}goodreads/finished`,
    fileName: `${process.env.DIRECTORYPATH}now-recent-books.json`,
    allowEmpty: false,
  },
  {
    name: 'Update Top Albums (This Month)',
    urlToUse: `${apiUrl}lastfm/topalbums?period=1month`,
    fileName: `${process.env.DIRECTORYPATH}now-top-albums.json`,
    allowEmpty: false,
  },
  {
    name: 'Update Top Artists (This Month)',
    urlToUse: `${apiUrl}lastfm/topartists?period=1month`,
    fileName: `${process.env.DIRECTORYPATH}now-top-artists.json`,
    allowEmpty: false,
  },
  {
    name: 'Update GitHub Projects',
    urlToUse: githubUrl,
    fileName: `${process.env.DIRECTORYPATH}now-github-projects.json`,
    allowEmpty: false,
  },
  {
    name: 'Update Board Games Wishlist',
    urlToUse: `${apiUrl}boardgamegeek/wishlist`,
    fileName: `${process.env.DIRECTORYPATH}collections-board-games-wishlist.json`,
    allowEmpty: false,
  },
  {
    name: 'Update Board Games Wishlist',
    urlToUse: `${apiUrl}boardgamegeek/owned`,
    fileName: `${process.env.DIRECTORYPATH}collections-board-games-owned.json`,
    allowEmpty: false,
  },
  {
    name: 'Update PixelFed Posts',
    urlToUse: `${apiUrl}pixelfed/posts`,
    fileName: `${process.env.DIRECTORYPATH}gallery-pixelfed-posts.json`,
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
