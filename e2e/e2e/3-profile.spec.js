const { test, expect } = require("@playwright/test");
const { register, login, generateUser } = require("./test-utils");

test.describe("3. Frofile API 테스트", () => {
  async function registerAndLogin(page, name, email, password) {
    await register(page, name, email, password);
    await login(page, email, password);
  }

  async function getWelcomeMessage(page, buttonText) {
    await page.click(`button:has-text("${buttonText}")`);
    await page.waitForLoadState("domcontentloaded");
    return await page.textContent("h2");
  }

  test("3-1. 로그인된 사용자의 프로필 조회", async ({ page }) => {
    const user = generateUser();
    await register(page, user.name, user.email, user.password);

    // 프로필 페이지로 이동합니다.
    await page.click('button:has-text("Profile")');
    await page.waitForLoadState("domcontentloaded");

    // 프로필 정보를 가져옵니다.
    const welcomeMessage = await page.textContent("h2");
    console.log("Welcome Message:", welcomeMessage);

    // 프로필 정보가 올바르게 반환되는지 확인합니다.
    expect(welcomeMessage).toBe("Welcome, " + user.name + "!");
  });

  test("3-2. 멀티 로그인 후 프로필 조회", async ({ context }) => {
    const page1 = await context.newPage();
    const page2 = await context.newPage();

    // 사용자 1로 회원가입 및 로그인
    const user1 = generateUser("사용자 1", "user1@mail.com", "validPassword");
    await registerAndLogin(page1, user1.name, user1.email, user1.password);
    // 사용자 2로 회원가입 및 로그인
    const user2 = generateUser("사용자 2", "user2@mail.com", "validPassword");
    await registerAndLogin(page2, user2.name, user2.email, user2.password);

    // 사용자 1의 프로필 페이지로 이동
    const welcomeMessage1 = await getWelcomeMessage(page1, "Profile");
    // 사용자 2의 프로필 페이지로 이동
    const welcomeMessage2 = await getWelcomeMessage(page2, "Profile");

    // 사용자 2의 프로필 정보가 올바르게 반환되는지 확인합니다.
    expect(welcomeMessage2).toBe(`Welcome, ${user2.name}!`);
    // 사용자 1의 프로필 정보가 올바르게 반환되는지 확인합니다.
    expect(welcomeMessage1).toBe(`Welcome, ${user1.name}!`);
  });
});
