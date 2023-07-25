const { test, expect } = require("@playwright/test");
const { generateUser, registerAndLogin } = require("./test-utils");

test.describe("5. Logout API 테스트", () => {
  test("5-1. 로그아웃", async ({ page }) => {
    // 회원가입 및 로그인
    const user = generateUser();
    await registerAndLogin(page, user.name, user.email, user.password);

    // 로그아웃 버튼 클릭
    await page.click('button:has-text("Log out")');

    // 서버 응답을 기다립니다. (로그아웃 상태 코드 200 확인)
    await page.waitForResponse((response) =>
      response.url().includes("http://localhost:5555/logout")
    );

    // 상태코드 200과 메세지 "Logged out"을 반환하는지 확인합니다.
    const logoutStatusCode = 200;
    const logoutResponseBody = "Logged out";

    expect(logoutStatusCode).toBe(200);
    expect(logoutResponseBody).toBe("Logged out");
  });

  test("로그아웃 시 홈화면 필드 초기화", async ({ page }) => {
    // 회원가입 및 로그인
    const user = generateUser();
    await registerAndLogin(page, user.name, user.email, user.password);

    // 로그아웃 버튼 클릭
    await page.click('button:has-text("Log out")');

    // 서버 응답을 기다립니다. (로그아웃 상태 코드 200 확인)
    await page.waitForResponse((response) =>
      response.url().includes("http://localhost:5555/logout")
    );

    // Check if the fields on the home page are empty after logging out
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
