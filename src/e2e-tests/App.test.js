import puppeteer from "puppeteer"; // 1

let browser;
let page;

beforeAll(async () => {
  browser = await puppeteer.launch({
    headless: false,
    slowMo: 50, // slow down by 50ms
  });
  page = await browser.newPage();
  await page.goto("http://localhost:3000/");
});

test("renders learn react link", async () => {
  await page.waitForSelector(".App");

  const header = await page.$eval(".App-header>p", e => e.innerHTML);
  expect(header).toBe(`Edit <code>src/App.js</code> and save to reload.`);

  const link = await page.$eval(".App-header>a", e => {
    return {
      innerHTML: e.innerHTML,
      href: e.href
    };
  });

  await page.waitForTimeout(3000);

  let expectedTitle = 'Learn React';
  let expectedUrl = 'https://reactjs.org/';
    // possibility to produce screenshot if a test fails
    if (link.innerHTML !== expectedTitle || link.href !== expectedUrl) {
      await page.screenshot({
        path: "./failed-tests/test_landing_page.png",
        fullPage: true,
      });
    }

  expect(link.innerHTML).toBe(expectedTitle);
  expect(link.href).toBe(expectedUrl);
});

afterAll(() => {
  browser.close();
});