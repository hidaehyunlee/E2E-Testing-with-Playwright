const { test, expect } = require("@playwright/test");
const {
  generateUser,
  registerAndLogin,
  getWelcomeMessage,
} = require("./test-utils");

test.describe("4. Update API 테스트", () => {
  test("4-1. 로그인된 사용자의 프로필 업데이트", async ({ page }) => {
    // 유효한 정보로 회원가입 및 로그인
    const user = generateUser();
    await registerAndLogin(page, user.name, user.email, user.password);

    const updatedName = "Updated User Name over 30 characters";

    // name 필드의 값 업데이트
    await page.fill('input[type="text"]', updatedName);
    await page.click('button:has-text("Update name")');

    await page.waitForResponse((response) =>
      response.url().includes("http://localhost:5555/update")
    );

    // 업데이트 된 프로필 정보 반영 확인
    const updatedWelcomeMessage = await page.textContent("h2");
    console.log("Updated Welcome Message:", updatedWelcomeMessage);
    expect(updatedWelcomeMessage).toBe("Welcome, " + updatedName + "!");
  });

  test("4-2. 업데이트 정보 미입력", async ({ page }) => {
    const user = generateUser();
    await registerAndLogin(page, user.name, user.email, user.password);

    // 이름 필드의 값을 입력하지 않고 업데이트
    await page.click('button:has-text("Update name")');

    // 200 상태코드 확인
    const updateResponse = await page.waitForResponse((response) =>
      response.url().includes("http://localhost:5555/update")
    );
    const updateStatusCode = updateResponse.status();
    expect(updateStatusCode).toBe(200);

    const updatedWelcomeMessage = await page.textContent("h2");
    console.log("Updated Welcome Message:", updatedWelcomeMessage);
    expect(updatedWelcomeMessage).toBe("Welcome, !");
  });

  test("4-3. 멀티 로그인 후 프로필 업데이트", async ({ context }) => {
    // 두 개의 페이지 생성
    const page1 = await context.newPage();
    const page2 = await context.newPage();

    // 사용자 1로 회원가입 및 로그인
    const user1 = generateUser("사용자 1", "user1@mail.com", "validPassword");
    await registerAndLogin(page1, user1.name, user1.email, user1.password);

    // 사용자 2로 회원가입 및 로그인
    const user2 = generateUser("사용자 2", "user2@mail.com", "validPassword");
    await registerAndLogin(page2, user2.name, user2.email, user2.password);

    // 사용자 2의 name 필드 업데이트
    await page2.click('button:has-text("Profile")');
    await page2.waitForLoadState("domcontentloaded");

    const updatedName = "사용자 2의 새 이름";
    await page2.fill('input[type="text"]', updatedName);
    await page2.click('button:has-text("Update name")');

    await page2.waitForResponse((response) =>
      response.url().includes("http://localhost:5555/update")
    );

    const welcomeMessage1 = await getWelcomeMessage(page1, "Profile");
    const welcomeMessage2 = await getWelcomeMessage(page2, "Profile");

    expect(welcomeMessage2).toBe("Welcome, " + updatedName + "!");
    // 사용자 1의 프로필 정보가 올바른지 확인. error. 사용자 2의 name
    expect(welcomeMessage1).toBe("Welcome, 사용자 1!");
  });
});
