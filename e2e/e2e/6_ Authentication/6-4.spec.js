const { test, expect } = require("@playwright/test");
const { register, loginWithResponse, generateUser } = require("../test-utils");

test("새로고침 후 현재페이지 유지", async ({ page }) => {
  // 회원가입 및 로그인
  const user = generateUser();
  await register(page, user.name, user.email, user.password);
  await loginWithResponse(page, user.email, user.password);

  // 페이지 새로고침
  await page.reload();

  // profile 페이지 유지 확인
  const pageTitle = "Welcome,";
  expect(await page.textContent("h2")).toContain(pageTitle);
});
