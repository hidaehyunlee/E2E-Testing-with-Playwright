const { test, expect } = require("@playwright/test");
const {
  generateUser,
  login,
  registerAndLogin,
  newContext,
  newPage,
} = require("./test-utils");

test.describe("6. 인증 상태 및 세션 테스트", () => {
  test("6-1. 새 탭에서 인증 상태 확인", async ({ context }) => {
    // 회원가입 및 로그인
    const page = await context.newPage();
    const user = generateUser();
    await registerAndLogin(page, user.name, user.email, user.password);

    // 새로운 탭에서 페이지 열기
    const newPage = await context.newPage();
    await newPage.goto("http://localhost:3000");

    // 인증 상태 확인을 위해 로그인 API 요청
    const response = await login(page, user.email, user.password);
    const statusCode = response.status();

    // 상태코드가 200이면 인증 유지로 간주
    const isLogin = statusCode === 200;
    expect(isLogin).toBeTruthy();
  });

  test("6-2. 새 브라우저 인증 상태 확인", async () => {
    const user = generateUser();

    const context1 = await newContext();
    const page1 = await newPage(context1);
    await registerAndLogin(page1, user.name, user.email, user.password);

    // 새 브라우저(클라이언트)
    const context2 = await newContext();
    const page2 = await newPage(context2);
    const response = await login(page2, user.email, user.password);
    const statusCode = response.status();

    // 상태코드가 200이면 인증 유지로 간주
    const isLogin = statusCode === 200;
    expect(isLogin).toBeTruthy();
  });

  test("6-3. 새로고침 후 인증 상태 확인", async ({ page }) => {
    // 회원가입 및 로그인
    const user = generateUser();
    await registerAndLogin(page, user.name, user.email, user.password);

    await page.reload();

    // 인증 상태 확인을 위해 로그인 API 요청
    const response = await login(page, user.email, user.password);
    const statusCode = response.status();

    // 상태코드가 200이면 인증 유지로 간주
    const isLogin = statusCode === 200;
    expect(isLogin).toBeTruthy();
  });

  test("6-4. 새로고침 후 현재페이지 유지", async ({ page }) => {
    // 회원가입 및 로그인
    const user = generateUser();
    await registerAndLogin(page, user.name, user.email, user.password);

    // 페이지 새로고침
    await page.reload();

    // profile 페이지 유지 확인
    const pageTitle = "Welcome,";
    expect(await page.textContent("h2")).toContain(pageTitle);
  });

  test("6-5. 잘못된 엔드포인트로 API 호출", async ({ page }) => {
    const response = await page.waitForResponse((response) =>
      response.url().includes("http://localhost:5555/hellohaechi")
    );

    const statusCode = response.status();
    expect(statusCode).toBe(404);

    const responseBody = await response.json();
    expect(responseBody.message).toBe("Not Found");
  });
});
