const puppeteer = require('puppeteer');
const username = process.env.LEETCODE_USERNAME;
const password = process.env.LEETCODE_PASSWORD;

const submitDailyChallenge = async () => {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    const context = browser.defaultBrowserContext();
    await context.overridePermissions('https://leetcode.com', ['clipboard-read']);
    await page.evaluate(() => {
        // mock clipboard
        let clipboardText = null;
        window["navigator"]["clipboard"] = {
            writeText: text => new Promise(resolve => clipboardText = text),
            readText: () => new Promise(resolve => resolve(clipboardText)),
        }
    })
    await page.goto('https://leetcode.com/problemset/all');
    // Click on Sign in Button
    await page.waitForSelector("#navbar_sign_in_button");
    await Promise.all([
        page.click("#navbar_sign_in_button"),
        page.waitForNavigation()
    ])
    // Enter username
    await page.waitForSelector("#id_login");
    await page.focus('#id_login');
    await page.keyboard.type(username);
    // Enter password
    await page.waitForSelector("#id_password");
    await page.focus('#id_password');
    await page.keyboard.type(password);
    // Click on Sign in Button
    await wait(3000);
    await page.waitForSelector("#signin_btn");
    await Promise.all([
        page.click("#signin_btn"),
        page.waitForNavigation()
    ])
    // Click on Daily Challenge button
    await page.waitForSelector('[id^="popover-trigger"]');
    await wait(3000);
    await page.click('[id^="popover-trigger"]');
    // Go to Editorial section
    await wait(3000);
    // await page.waitForNavigation();
    const dailyChallengeURL = page.url();
    await page.goto(dailyChallengeURL + "editorial");
    await wait(10000);
    // Click on Copy button in Code playground
    const frames = page.frames().filter(f => f.url().startsWith('https://leetcode.com/playground/'));
    const frame = frames[frames.length - 1];
    await frame.waitForSelector('button[class="btn copy-code-btn btn-default"]');
    await frame.click('button[class="btn copy-code-btn btn-default"]');
    const solutionCode = await page.evaluate(() => navigator.clipboard.readText());
    // Paste editorial code in code editor
    await page.waitForSelector('[class="inputarea monaco-mouse-cursor-text"');
    await page.focus('[class="inputarea monaco-mouse-cursor-text"');
    await page.keyboard.down('Control');
    await page.keyboard.press('A');
    await page.keyboard.up('Control');
    await page.keyboard.press('Backspace');
    await page.keyboard.type(solutionCode);
    // Click on Submit button
    await page.click('[data-e2e-locator="console-submit-button"]');
    // Wait for code to upload & execute
    await wait(10000);
    await browser.close();
}

const wait = ms => new Promise(resolve => setTimeout(resolve, ms));

submitDailyChallenge().then(() => {
    console.log("Submitted Daily Challenge!");
}).catch(err => {
    console.log(err);
});