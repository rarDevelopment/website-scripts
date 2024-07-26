import fs from 'fs';
import 'dotenv/config';

//modified from: https://github.com/rknightuk/api/blob/117aade2783beeb09686e9f7e7d3775facf06722/services/discussion.js

const hashtag = '#rardkblogpost';
const hashtagRegexPattern = /#rardkblogpost\d+/g;
const mastodonHashtagRegexPattern = /rardkblogpost\d+/g;
const mastodonUrl = `https://mastodon.social/api/v1/accounts/425168/statuses?exclude_replies=true&limit=50&exclude_reblogs=true`;
const blueskyUrl = `https://bsky.social/xrpc/com.atproto.repo.listRecords?collection=app.bsky.feed.post&repo=rardk64.com`;
const fileName = `${process.env.DIRECTORYPATH}discussion-blog-posts.json`;

async function run() {
  let discussion = JSON.parse(fs.readFileSync(fileName));
  try {
    const res = await fetch(mastodonUrl);
    const mastodonPosts = await res.json();
    mastodonPosts.forEach((t) => {
      const foundHashtag = t.tags.find((tag) =>
        //mastodon doesn't include the # in the tag name in the separated tags objects
        tag.name.match(mastodonHashtagRegexPattern)
      );
      const isSyndicate = foundHashtag ? true : false;
      if (isSyndicate) {
        let path = foundHashtag.name.replace(hashtag.replace('#', ''), '');
        if (!discussion[path]) {
          discussion[path] = {
            mastodon: [],
            bluesky: [],
          };
        }
        const existingPost = discussion[path].mastodon.find((e) => e.id === t.id);
        if (!existingPost) {
          discussion[path].mastodon.push(t);
        } else {
          const index = discussion[path].mastodon.indexOf(existingPost);
          discussion[path].mastodon[index] = t;
        }
      }
    });
  } catch (error) {
    console.error('unable to fetch mastodon data', error);
  }
  try {
    const res = await fetch(blueskyUrl);
    const blueskyResponse = await res.json();
    blueskyResponse.records.forEach((b) => {
      const isSyndicate = b.value.text.match(hashtagRegexPattern);
      if (isSyndicate) {
        const indexOfHashtag = b.value.text.indexOf(hashtag);
        const hashtagAndAfter = b.value.text
          .slice(indexOfHashtag + 1)
          .replace(hashtag.replace('#', ''), '');
        const indexOfNextNonDigit = hashtagAndAfter.search(/\D/);
        const endIndex =
          indexOfNextNonDigit !== -1
            ? indexOfHashtag + hashtag.length + indexOfNextNonDigit
            : undefined;
        const path = b.value.text.slice(indexOfHashtag + hashtag.length, endIndex);
        if (!discussion[path])
          discussion[path] = {
            mastodon: [],
            bluesky: [],
          };
        const existingPost = discussion[path].bluesky.find((e) => e.cid === b.cid);
        if (!existingPost) {
          discussion[path].bluesky.push(b);
        } else {
          const index = discussion[path].bluesky.indexOf(existingPost);
          discussion[path].bluesky[index] = b;
        }
      }
    });
  } catch (error) {
    console.error('unable to fetch bluesky data', error);
  }
  fs.writeFileSync(fileName, JSON.stringify(discussion, '', 2));
}

run();
