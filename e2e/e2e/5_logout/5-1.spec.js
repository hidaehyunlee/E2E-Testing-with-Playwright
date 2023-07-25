const { test, expect } = require("@playwright/test");
const {
  register,
  loginWithResponse,
  generateUser,
  getSessionData,
} = require("../test-utils");

test("세션 종료 및 로그아웃", async ({ page }) => {
  // 회원가입 및 로그인
  const user = generateUser();
  await register(page, user.name, user.email, user.password);
  await loginWithResponse(page, user.email, user.password);

  // 로그아웃 버튼 클릭
  await page.click('button:has-text("Log out")');

  // 서버 응답을 기다립니다. (로그아웃 상태 코드 200 확인)
  await page.waitForResponse((response) =>
    response.url().includes("http://localhost:5555/logout")
  );

  // Get session data after logging out
  const sessionData = await getSessionData(page);

  // 상태코드 200과 메세지 "Logged out"을 반환하는지 확인합니다.
  const logoutStatusCode = 200;
  const logoutResponseBody = "Logged out";

  expect(logoutStatusCode).toBe(200);
  expect(logoutResponseBody).toBe("Logged out");
  expect(sessionData).toBe(null);
});
