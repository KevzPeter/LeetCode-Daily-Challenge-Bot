const credentials = require("./credentials.json");
const username = process.env.LEETCODE_USERNAME || credentials.USERNAME;
const password = process.env.LEETCODE_PASSWORD || credentials.PASSWORD;

const signIn = async (page) => {
    await page.goto('https://leetcode.com/problemset/all');
    // Click on Sign in Button
    await page.waitForSelector("#navbar_sign_in_button");
    await Promise.all([
        page.click("#navbar_sign_in_button"),
        page.waitForNavigation()
    ])
    console.log(`Signing in as ${username}`);
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
    console.log(`Signed in successfully!`);
}
const clickDailyChallengeBtn = async (page) => {
    await page.waitForSelector('[id^="popover-trigger"]');
    await wait(3000);
    await page.click('[id^="popover-trigger"]');
}
const goToEditorial = async (challengePage) => {
    const dailyChallengeURL = challengePage.url();
    const dailyChallengeName = dailyChallengeURL.split("/")[4];
    console.log(`Today's Daily Challenge:  ${dailyChallengeName}`);
    await challengePage.goto(dailyChallengeURL + "editorial");
    await wait(10000);
}
const copyCodePlayGround = async (challengePage) => {
    const frames = challengePage.frames().filter(f => f.url().startsWith('https://leetcode.com/playground/'));
    const frame = frames[frames.length - 1];
    await frame.waitForSelector('button[class="btn copy-code-btn btn-default"]');
    await frame.click('button[class="btn copy-code-btn btn-default"]');
    const solutionCode = await challengePage.evaluate(() => navigator.clipboard.readText());
    console.log("Successfully copied solution:\n", solutionCode);
}
const pasteCode = async (challengePage) => {
    await challengePage.waitForSelector('[class="inputarea monaco-mouse-cursor-text"]');
    await challengePage.focus('[class="inputarea monaco-mouse-cursor-text"]');
    await selectAll(challengePage);
    await backSpace(challengePage);
    await paste(challengePage);
}
const selectAll = async (challengePage) => {
    await challengePage.keyboard.down('Control');
    await challengePage.keyboard.press('A');
    await challengePage.keyboard.up('Control');
}
const backSpace = async (challengePage) => {
    await challengePage.keyboard.press('Backspace');
}
const paste = async (challengePage) => {
    await challengePage.keyboard.down('Control');
    await challengePage.keyboard.press('V');
    await challengePage.keyboard.up('Control');
}
const submitSolution = async (challengePage) => {
    await challengePage.click('[data-e2e-locator="console-submit-button"]');
    console.log("Solution submitted");
    // Wait for code to upload & execute
    await wait(10000);
}
const wait = ms => new Promise(resolve => setTimeout(resolve, ms));

module.exports = { signIn, clickDailyChallengeBtn, wait, goToEditorial, copyCodePlayGround, pasteCode, selectAll, backSpace, paste, submitSolution }