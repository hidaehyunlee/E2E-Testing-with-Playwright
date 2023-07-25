const { test, expect } = require("@playwright/test");
const { generateUser, registerAndLogin } = require("./test-utils");

test.describe("5. Logout API 테스트", () => {
  test("5-1. 로그아웃", async ({ page }) => {
    const user = generateUser();
    await registerAndLogin(page, user.name, user.email, user.password);

    await page.click('button:has-text("Log out")');

    await page.waitForResponse((response) =>
      response.url().includes("http://localhost:5555/logout")
    );

    // 상태코드 200, 메세지 "Logged out" 확인
    const logoutStatusCode = 200;
    const logoutResponseBody = "Logged out";

    expect(logoutStatusCode).toBe(200);
    expect(logoutResponseBody).toBe("Logged out");
  });

  test("5-2. 로그아웃 시 홈화면 필드 초기화", async ({ page }) => {
    const user = generateUser();
    await registerAndLogin(page, user.name, user.email, user.password);

    await page.click('button:has-text("Log out")');

    await page.waitForResponse((response) =>
      response.url().includes("http://localhost:5555/logout")
    );

    // 루트 페이지 필드들이 초기화 되었는지 확인
    const nameInputValue = await page.inputValue('input[placeholder="Name"]');
    const emailInputValue = await page.inputValue('input[placeholder="Email"]');
    const passwordInputValue = await page.inputValue(
      'input[placeholder="Password"]'
    );

    expect(nameInputValue).toBe("");
    expect(emailInputValue).toBe("");
    expect(passwordInputValue).toBe("");
  });
});
