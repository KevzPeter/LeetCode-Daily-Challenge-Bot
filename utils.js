const credentials = require("./credentials.json");
const username = process.env.LEETCODE_USERNAME || credentials.USERNAME;
const password = process.env.LEETCODE_PASSWORD || credentials.PASSWORD;
const validLanguages = ['C++', 'Java', 'Python3'];

const signIn = async (page) => {
    await page.goto('https://leetcode.com/problemset/all');
    // Click on Sign in Button
    await page.waitForSelector("#navbar_sign_in_button");
    await Promise.all([
        page.click("#navbar_sign_in_button"),
        page.waitForNavigation()
    ])
    console.log(`🔑 Signing in as ${username}`);
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
    console.log(`✅ Signed in!`);
}
const clickDailyChallengeBtn = async (page) => {
    await page.waitForSelector('[id^="popover-trigger"]');
    await wait(3000);
    await page.click('[id^="popover-trigger"]');
}
const goToEditorial = async (challengePage) => {
    const dailyChallengeURL = challengePage.url();
    const dailyChallengeName = dailyChallengeURL.split("/")[4];
    console.log(`📍 Today's Daily Challenge:  ${dailyChallengeName}`);
    await challengePage.goto(dailyChallengeURL + "editorial");
    await wait(10000);
}
const copyCodePlayGround = async (challengePage, preferredLanguage) => {
    const frames = challengePage.frames().filter(f => f.url().startsWith('https://leetcode.com/playground/'));
    const frame = frames[frames.length - 1];
    await chooseLanguage(challengePage, frame, preferredLanguage);
    await frame.waitForSelector('button[class="btn copy-code-btn btn-default"]');
    await frame.click('button[class="btn copy-code-btn btn-default"]');
    const solutionCode = await challengePage.evaluate(() => navigator.clipboard.readText());
    console.log("📄 Here's the Solution:\n", solutionCode);
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
    console.log("✅ Solution submitted");
    // Wait for code to upload & execute
    await wait(10000);
}
const validateLanguage = (input) => {
    if (!input || input.trim().length === 0) return null;
    input = input.trim().toLowerCase();
    validLanguages.forEach((language, index, arr) => {
        if (input === language.toLowerCase()) {
            input = language;
        }
    });
    return input;
}
const chooseLanguage = async (challengePage, frame, preferredLanguage) => {
    const [languageBtn] = await frame.$x(`//div[@class='lang-btn-set']//button[contains(., '${preferredLanguage}')]`);
    if (languageBtn) {
        await languageBtn.click();
        await challengePage.waitForSelector('button[id^="headlessui-listbox-button"]');
        await challengePage.click('button[id^="headlessui-listbox-button"]');
        await wait(1500);
        await challengePage.waitForSelector("ul[id^='headlessui-listbox-options'] > li > div > div")
        const languageOptions = await challengePage.$$(`ul[id^='headlessui-listbox-options'] > li > div > div`);
        for (const option of languageOptions) {
            language = await option.evaluate(option => option.textContent);
            if (language === preferredLanguage) {
                await option.click();
            }
        }
        await wait(1500);
    }
}
const wait = ms => new Promise(resolve => setTimeout(resolve, ms));

module.exports = { signIn, clickDailyChallengeBtn, wait, goToEditorial, copyCodePlayGround, pasteCode, selectAll, backSpace, paste, submitSolution, validateLanguage }