import fs from 'fs';
import 'dotenv/config';

const apiUrl = process.env.API_URL;

const legoSetsUrl = `${apiUrl}json/lego-sets`;
const legoSetsWithImagesUrl = `${apiUrl}json/lego-sets-with-images`;
const legoImageUrl = `${apiUrl}lego/image?url={{SET_URL}}`;
const fileName = `${process.env.DIRECTORYPATH}lego-sets-images.json`;

try {
  const legoSetsResponse = await fetch(legoSetsUrl);
  const legoSetsWithImagesResponse = await fetch(legoSetsWithImagesUrl);

  const legoSets = await legoSetsResponse.json();
  const existingLegoSetsWithImages = await legoSetsWithImagesResponse.json();

  let legoSetsWithImages = [];
  if (legoSets && legoSets.length > 0) {
    await Promise.all(
      legoSets.map(async (set) => {
        var existingSet = existingLegoSetsWithImages.find(
          (existingSet) => existingSet.url === set.url
        );
        if (existingSet && existingSet.imageUrl && existingSet.previewUrl) {
          legoSetsWithImages.push(existingSet);
          return;
        }
        const response = await fetch(legoImageUrl.replace('{{SET_URL}}', set.url));
        const imageUrlData = await response.json();
        set.imageUrl = imageUrlData.imageUrl;
        set.previewUrl = imageUrlData.previewUrl;
        legoSetsWithImages.push(set);
      })
    );

    fs.writeFileSync(fileName, JSON.stringify(legoSetsWithImages, '', 2), { flag: 'w' });
  }
} catch (error) {
  console.error(`Lego Set Meta Updater failed`, error);
}
