//TODO: this doesn't work for some reason

import * as ftp from "basic-ftp";
import 'dotenv/config';

doUpload();

async function doUpload() {
    const client = new ftp.Client()
    client.ftp.verbose = false;
    try {
        await client.access({
            host: `${process.env.HOST}`,
            user: `${process.env.USERNAME}`,
            password: `${process.env.PASSWORD}`,
            secure: true,
            secureOptions: {
                host: `${process.env.HOST}`,
            }
        });
        console.log(await client.list())
        await client.ensureDir("/public_html/json/social-finder");
        await client.clearWorkingDir();
        await client.uploadFrom("discussion-blog-posts.json", "discussion-blog-posts.json");
        await client.uploadFrom("discussion-link-posts.json", "discussion-link-posts.json");
    }
    catch (err) {
        console.error(err)
    }
    client.close()
}
