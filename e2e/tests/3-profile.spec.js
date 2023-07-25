const { test, expect } = require("@playwright/test");
const {
  register,
  generateUser,
  registerAndLogin,
  getWelcomeMessage,
} = require("./test-utils");

test.describe("3. Frofile API 테스트", () => {
  test("3-1. 로그인된 사용자의 프로필 조회", async ({ page }) => {
    // 유효한 정보로 회원가입 및 로그인
    const user = generateUser();
    await registerAndLogin(page, user.name, user.email, user.password);

    // 세션 인증 후 프로필 페이지로 이동
    await page.click('button:has-text("Profile")');
    await page.waitForLoadState("domcontentloaded");

    // 프로필 정보(user.name) 확인
    const welcomeMessage = await page.textContent("h2");
    console.log("Welcome Message:", welcomeMessage);

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

    // 사용자 2의 프로필 정보 확인
    expect(welcomeMessage2).toBe(`Welcome, ${user2.name}!`);
    // 사용자 1의 프로필 정보 확인. error 발생. user2.name
    expect(welcomeMessage1).toBe(`Welcome, ${user1.name}!`);
  });
});
