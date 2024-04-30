import fs from 'fs';
import 'dotenv/config';

const apiUrl = process.env.API_URL;

const legoSetsUrl = `${apiUrl}json/lego-sets`;
const legoImageUrl = `${apiUrl}lego/image?url={{SET_URL}}`;
const fileName = `${process.env.DIRECTORYPATH}lego-sets-images.json`;

try {
  const legoSetsResponse = await fetch(legoSetsUrl);
  const legoSets = await legoSetsResponse.json();
  let legoSetsWithImages = [];
  if (legoSets && legoSets.length > 0) {
    await Promise.all(
      legoSets.map(async (set) => {
        const response = await fetch(legoImageUrl.replace('{{SET_URL}}', set.url));
        const imageUrl = await response.text();
        set.imageUrl = imageUrl;
        legoSetsWithImages.push(set);
      })
    );

    fs.writeFileSync(fileName, JSON.stringify(legoSetsWithImages, '', 2), { flag: 'w' });
  }
} catch (error) {
  console.error(`Lego Set Meta Updater failed`, error);
}
