import fs from 'fs';
import 'dotenv/config';

const apiUrl = process.env.API_URL;

const legoSetsUrl = `${apiUrl}json/lego-sets`;
const legoImageUrl = `${apiUrl}lego/image?url={{SET_URL}}`;
const fileName = `${process.env.DIRECTORYPATH}lego-sets-images.json`;
const allowEmpty = false;

try {
  const legoSetsResponse = await fetch(legoSetsUrl);
  const legoSets = await legoSetsResponse.json();
  let legoSetsWithImages = [];
  await Promise.all(
    legoSets.map(async (set) => {
      const response = await fetch(legoImageUrl.replace('{{SET_URL}}', set.url));
      const imageUrl = await response.text();
      set.imageUrl = imageUrl;
      legoSetsWithImages.push(set);
      console.log('set updated with image', set);
    })
  );

  fs.writeFileSync(fileName, JSON.stringify(legoSetsWithImages, '', 2), { flag: 'w' });
} catch (error) {
  console.error(`Lego Set Meta Updater failed`, error);
}
