// test-utils.js
const { chromium } = require("playwright");

const generateRandomEmail = () => {
  // Generate a random string for the email
  const randomString = Math.random().toString(36).substring(7);
  return `${randomString}@mail.com`;
};

const generateUser = (name, email, password) => {
  return {
    name: name || "이대현",
    email: email || generateRandomEmail(),
    password: password || "validPassword",
  };
};

const register = async (page, name, email, password) => {
  const user = generateUser(name, email, password);

  await page.goto("http://localhost:3000");
  await page.fill('input[placeholder="Name"]', user.name);
  await page.fill('input[placeholder="Email"]', user.email);
  await page.fill('input[placeholder="Password"]', user.password);
  await page.click('button:has-text("Register")');

  // 서버 응답을 기다립니다. (회원가입 상태 코드 200 확인)
  const response = await page.waitForResponse((response) =>
    response.url().includes("http://localhost:5555/register")
  );
    
    return response;
};

const login = async (page, email, password) => {
  const user = generateUser(null, email, password);

  await page.goto("http://localhost:3000");
  await page.fill('input[placeholder="Email"]', user.email);
  await page.fill('input[placeholder="Password"]', user.password);
  await page.click('button:has-text("Log in")');

  // 서버 응답을 기다립니다. (로그인 상태 코드 200 확인)
  const loginResponse = await page.waitForResponse((response) =>
    response.url().includes("http://localhost:5555/login")
  );

  return loginResponse; // 로그인 응답 객체를 반환합니다.
};

async function newContext() {
  return await chromium.launch();
}

async function newPage(context) {
  return await context.newPage();
}

async function registerAndLogin(page, name, email, password) {
  await register(page, name, email, password);
  await login(page, email, password);
}

async function getWelcomeMessage(page, buttonText) {
  await page.click(`button:has-text("${buttonText}")`);
  await page.waitForLoadState("domcontentloaded");
  return await page.textContent("h2");
}

module.exports = {
  register,
  login,
  generateUser,
  newContext,
  newPage,
  registerAndLogin,
  getWelcomeMessage,
};
