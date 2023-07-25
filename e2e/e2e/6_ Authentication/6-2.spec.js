const { test, expect } = require("@playwright/test");
const {
  register,
  loginWithResponse,
  generateUser,
  newContext,
  newPage,
} = require("../test-utils");

test("새 브라우저 인증 상태 확인", async () => {
  // Register a user and log in from one client (existing page).
  const user = generateUser();

  const context1 = await newContext();
  const page1 = await newPage(context1);
  await register(page1, user.name, user.email, user.password);
  await loginWithResponse(page1, user.email, user.password);

  // Open a new browser context to simulate a new browser (new client).
  const context2 = await newContext();
  const page2 = await newPage(context2);
  const response = await loginWithResponse(page2, user.email, user.password);
  const statusCode = response.status();

  // 상태코드가 200이면 인증 유지로 간주
  const isLogin = statusCode === 200;
  expect(isLogin).toBeTruthy();
});
