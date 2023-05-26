const puppeteer = require('puppeteer');
const { signIn, clickDailyChallengeBtn, wait, goToEditorial, copyCodePlayGround, pasteCode, submitSolution } = require("./utils");

const submitDailyChallenge = async () => {
    const browser = await puppeteer.launch({ headless: 'new' });
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
    // Sign in using your LeetCode credentials
    await signIn(page);
    // Click on Daily Challenge button
    await clickDailyChallengeBtn(page);
    // Go to Editorial section
    await wait(3000);
    const [_aboutBlank, _problemSetPage, challengePage] = await browser.pages();
    await goToEditorial(challengePage);
    // Click on Copy button in Code playground
    await copyCodePlayGround(challengePage);
    // Paste editorial code in code editor
    await pasteCode(challengePage);
    // Click submit and wait for acceptance
    await submitSolution(challengePage);
    await browser.close();
}

submitDailyChallenge().then(() => {
    console.info("Daily Challenge complete! ✅");
    console.info("You've unlocked 10 leetcoins 🪙");
}).catch(err => {
    console.log(err);
});