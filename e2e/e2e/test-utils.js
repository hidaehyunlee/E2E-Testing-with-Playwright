// test-utils.js
const generateUser = (name, email, password) => {
  return {
    name: name || "이대현",
    email: email || "hidaehyunlee@gmail.com",
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
  await page.waitForResponse((response) =>
    response.url().includes("http://localhost:5555/register")
  );
};

const loginWithResponse = async (page, email, password) => {
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

const getSessionData = async (page) => {
  const sessionData = await page.evaluate(() => {
    return JSON.parse(localStorage.getItem("session"));
  });
  return sessionData;
};


module.exports = {
  register,
  loginWithResponse,
  generateUser,
  getSessionData,
};
