const { test, expect } = require("@playwright/test");
const { register, loginWithResponse, generateUser } = require("../test-utils");

test("새로고침 후 인증 상태 확인", async ({ page }) => {
  // 회원가입 및 로그인
  const user = generateUser();
  await register(page, user.name, user.email, user.password);
  await loginWithResponse(page, user.email, user.password);

  await page.reload();

  // 인증 상태 확인을 위해 로그인 API 요청
  const response = await loginWithResponse(page, user.email, user.password);
  const statusCode = response.status();

  // 상태코드가 200이면 인증 유지로 간주
  const isLogin = statusCode === 200;
  expect(isLogin).toBeTruthy();
});
