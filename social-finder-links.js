import extractUrls from 'extract-urls'
import fs from 'fs'
import 'dotenv/config';
import fetch from "node-fetch";

//modified from: https://github.com/rknightuk/api/blob/117aade2783beeb09686e9f7e7d3775facf06722/services/discussion.js

const urlRegexPattern = /https:\/\/(www.)?rardk\.com\/links/g;
const mastodonUrl = `https://mastodon.social/api/v1/accounts/425168/statuses?exclude_replies=true&limit=50&exclude_reblogs=true`;
const blueskyUrl = `https://bsky.social/xrpc/com.atproto.repo.listRecords?collection=app.bsky.feed.post&repo=rardk64.com`;
const fileName = `${process.env.DIRECTORYPATH}discussion-links-posts.json`;

async function run() {
    let discussion = JSON.parse(fs.readFileSync(fileName));
    try {

        const res = await fetch(mastodonUrl)

        const mastodonPosts = await res.json()

        mastodonPosts.forEach(t => {
            const urls = (extractUrls(t.content) || []).filter(url => url.match(urlRegexPattern))
            const isSyndicate = urls.some(url => url.match(urlRegexPattern))
            if (isSyndicate) {
                urls.forEach(url => {
                    let path = new URL(url).pathname
                    if (!discussion[path]) {
                        discussion[path] = {
                            mastodon: [],
                            bluesky: []
                        }
                    }
                    const existingPost = discussion[path].mastodon.find(e => e.id === t.id);
                    if (!existingPost) {
                        discussion[path].mastodon.push(t);
                    }
                    else {
                        const index = discussion[path].mastodon.indexOf(existingPost);
                        discussion[path].mastodon[index] = t;
                    }
                })
            }
        })
    } catch (error) {
        console.error('unable to fetch mastodon data', error)
    }
    try {
        const res = await fetch(blueskyUrl)

        const blueskyResponse = await res.json()

        blueskyResponse.records.forEach(b => {

            const urls = getLinksFromBlueSkyPost(b);

            const isSyndicate = urls.some(url => url.match(urlRegexPattern))
            if (isSyndicate) {
                urls.forEach(url => {
                    let path = new URL(url).pathname
                    if (!discussion[path]) discussion[path] = {
                        mastodon: [],
                        bluesky: []
                    }
                    const existingPost = discussion[path].bluesky.find(e => e.cid === b.cid);
                    if (!existingPost) {
                        discussion[path].bluesky.push(b);
                    }
                    else {
                        const index = discussion[path].bluesky.indexOf(existingPost);
                        discussion[path].bluesky[index] = b;
                    }
                })
            }
        })
    } catch (error) {
        console.error('unable to fetch bluesky data', error)
    }
    fs.writeFileSync(fileName, JSON.stringify(discussion, '', 2))
}

function getLinksFromBlueSkyPost(post) {
    const facets = post.value.facets;
    if (!facets) {
        return []
    };
    let links = [];
    facets.forEach(f => f.features.forEach(feat => {
        if (feat.$type === 'app.bsky.richtext.facet#link') {
            links.push(feat.uri)
        }
    }));
    return links;
}

run()
