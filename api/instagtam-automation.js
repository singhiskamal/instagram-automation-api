const puppeteer = require('puppeteer');
const fs = require('fs');
const config = './config.json';

exports.autoLikeHashtagsPost = function (req, res) {
    let hashtag = "food";
    try {
        if (req.query.hashtag)
            hashtag = req.query.hashtag;

        fs.readFile(config, 'utf8', async function (err, data) {
            if (err) throw err;
            try {
                var configData = JSON.parse(data);
            } catch (e) {
                res.send({automation: "failed", hashtag: hashtag, no_of_post_to_like: 2, message: e.message});
                return;
            }

            let proxy = "";
            if (configData.proxy_ip && configData.proxy_port === "") {
                res.send({
                    automation: "failed",
                    hashtag: hashtag,
                    no_of_post_to_like: 2,
                    message: "please provide proxy ip also."
                });
                return;
            } else if (configData.proxy_ip && configData.proxy_port) {
                proxy = configData.proxy_ip + ":" + configData.proxy_port;
            }

            let browser = await puppeteer.launch({
                executablePath: configData.browser_url,
                headless: false,
                defaultViewport: {width: 2000, height: 1024},
                args: ['--proxy-server=' + proxy]
            });

            const page = await browser.newPage();

            if (configData.proxy_username && configData.proxy_password) {
                await page.authenticate({
                    username: configData.proxy_username,
                    password: configData.proxy_password
                });
            }

            await page.goto("https://www.instagram.com/accounts/login/?source=auth_switcher", {
                waitUntil: "networkidle0"
            }).catch(e => console.log("Go to error : " + e.message));

            await page.type('input[name=username]', configData.instagram_username, {delay: 20});
            await page.type('input[name=password]', configData.instagram_password, {delay: 20});

            await page.click('button[type=submit]');
            await page.waitForNavigation();

            await page.click('div[role=dialog] div div:nth-child(3) button:nth-child(1)');

            await page.goto("https://www.instagram.com/explore/tags/" + hashtag + "/", {
                waitUntil: "networkidle0"
            }).catch(e => console.log("Go to error : " + e.message));

            for (let index = 1; index <= 2; index++) {
                if (await page.$('.dialog-404') !== null) {
                    console.log('hastag not found');
                    return;
                }
                const page1 = await browser.newPage();
                let selector = 'article div div div div:nth-child(' + index + ') a';

                let postUrl = await page.evaluate((sel) => {
                    return document.querySelector(sel).href;
                }, selector);
                await page1.goto(postUrl, {
                    waitUntil: "networkidle0"
                }).catch(e => console.log("Go to error : " + e.message));
                await page1.click('article div:nth-child(3) section:nth-child(1) span button');
            }
        });
    } catch (e) {
        res.send({automation: "failed", hashtag: hashtag, no_of_post_to_like: 2, message: e.message})

    }
    res.send({automation: "success", hashtag: hashtag, no_of_post_to_like: 2, message: "Running.."})
};

exports.autoLikeInfluencerPost = function (req, res) {
    let instaId = "akshaykumar";
    try {
        if (req.query.insta_id)
            instaId = req.query.insta_id;

        fs.readFile(config, 'utf8', async function (err, data) {
            if (err) throw err;
            try {
                var configData = JSON.parse(data);
            } catch (e) {
                res.send({automation: "failed", influencer_id: instaId, no_of_post_to_like: 2, message: e.message})
                return;
            }

            let proxy = "";
            if (configData.proxy_ip && configData.proxy_port === "") {
                res.send({
                    automation: "failed",
                    influencer_id: instaId,
                    no_of_post_to_like: 2,
                    message: "please provide proxy ip also."
                });
                return;
            } else if (configData.proxy_ip && configData.proxy_port) {
                proxy = configData.proxy_ip + ":" + configData.proxy_port;
            }

            let browser = await puppeteer.launch({
                executablePath: configData.browser_url,
                headless: false,
                defaultViewport: {width: 2000, height: 1024},
                args: ['--proxy-server=' + proxy]
            });

            const page = await browser.newPage();

            if (configData.proxy_username && configData.proxy_password) {
                await page.authenticate({
                    username: configData.proxy_username,
                    password: configData.proxy_password
                });
            }

            await page.goto("https://www.instagram.com/accounts/login/?source=auth_switcher", {
                waitUntil: "networkidle0"
            }).catch(e => console.log("Go to error : " + e.message));

            await page.type('input[name=username]', configData.instagram_username, {delay: 20});
            await page.type('input[name=password]', configData.instagram_password, {delay: 20});

            await page.click('button[type=submit]');
            await page.waitForNavigation();

            await page.goto("https://www.instagram.com/" + instaId + "/", {
                waitUntil: "networkidle0"
            }).catch(e => console.log("Go to error : " + e.message));

            for (let index = 1; index <= 2; index++) {
                if (await page.$('.dialog-404') !== null) {
                    console.log('Profile not found');
                    return;
                }
                const page1 = await browser.newPage();
                let selector = 'article div div div div:nth-child(' + index + ') a';
                let postUrl = await page.evaluate((sel) => {
                    return document.querySelector(sel).href;
                }, selector);
                await page1.goto(postUrl, {
                    waitUntil: "networkidle0"
                }).catch(e => console.log("Go to error : " + e.message));
                await page1.click('article div:nth-child(3) section:nth-child(1) span button');
            }
        });
    } catch (e) {
        res.send({automation: "failed", influencer_id: instaId, no_of_post_to_like: 2, message: e.message})

    }

    res.send({automation: "success", influencer_id: instaId, no_of_post_to_like: 2, message: "Running.."})

};




