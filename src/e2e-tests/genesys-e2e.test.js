import puppeteer from "puppeteer";

let browser;
let page;

beforeAll(async () => {
  browser = await puppeteer.launch({
    headless: true,
    slowMo: 50, // slow down by 50ms
    defaultViewport: {
      width: 1280,
      height: 800,
    },
    devtools: false,
  });

  page = await browser.newPage();
  await page.goto("https://genesys-xperience-development.web.app/");
});

test.skip("login successful should redirect to landing page", async () => {

  // fill the username and pw
  await page.type('input[name="email"]', "bruno@dexper.io");
  await page.waitForTimeout(1000);
  await page.type('input[name="password"]', "dexB#$%1234");
  await page.waitForTimeout(1000);

  // submit
  await page.click('button[type="submit"]');
  await page.setDefaultNavigationTimeout(0);
  await page.waitForTimeout(4000);


  const nextPageUrl = page.url();
  const expectedUrl ="https://genesys-xperience-development.web.app/landing-page";
  console.log(page.url());

  // possibility to produce screenshot if a test fails
  if (nextPageUrl !== expectedUrl) {
    await page.screenshot({
      path: "./failed-tests/test_login.png",
      fullPage: true,
    });
  } else {
    //todo logout

  }

  expect(nextPageUrl).toBe(expectedUrl);
});

test.skip("In the profile page, user should change his job title successufly", async () => {
  await page.waitForTimeout(5000);

  // clicking through selectors (space for improvments on current apps)
  await page.click('svg[width="14"]');
  await page.waitForTimeout(2000);
  await page.click(".sc-iQQLPo.clYQWW > a");
  await page.waitForTimeout(1000);

  const currentTitle = await page.evaluate(() => {
    const jt = document.querySelector("input[name=jobTitle]");
    // possibility to debug
    // debugger;
    return jt.value;
  });

  // filling input and save
  await page.$eval("input[name=jobTitle]", (el) => (el.value = ``));
  await page.type("input[name=jobTitle]", `Title_${Math.random()}`);

  // saving new title
  await page.waitForTimeout(2000);
  await page.click('button[type="submit"]');
  await page.waitForTimeout(2000);

  // get the title that users has changed
  const changedTitle = await page.evaluate(() => {
    const jt = document.querySelector("input[name=jobTitle]");
    return jt.value;
  });

  // possibility to console.log partial results during test
  console.log(currentTitle);
  console.log(changedTitle);

  // go to View Profile
  await page.click("section > button.sc-gtsrHT.bmBGr");
  await page.waitForTimeout(5000);

  // get the text inside modal
  const newTitle = await page.evaluate(() => {
    const jt = document.querySelector(
      ".hAWbJv.modal > div > div > div > div > div.sc-dwxYdI.frbeFm > p"
    );
    return jt.innerHTML;
  });
  console.log("newTitle : ", newTitle);

  // possibility to produce screenshot if a test fails
  if (currentTitle === changedTitle || !newTitle.includes(changedTitle)) {
    await page.screenshot({
      path: "./failed-tests/test_profile.png",
      fullPage: true,
    });
  }

  // test assertion
  expect(currentTitle).not.toBe(changedTitle);
  expect(newTitle).toContain(changedTitle);
});

afterAll(() => {
  browser.close();
});
