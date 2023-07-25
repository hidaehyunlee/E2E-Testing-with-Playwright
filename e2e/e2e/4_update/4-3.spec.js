const { test, expect } = require("@playwright/test");
const { register, login } = require("../test-utils");

test("멀티 로그인 후 프로필 업데이트", async ({ context }) => {
  // Create two new pages within the same context
  const page1 = await context.newPage();
  const page2 = await context.newPage();

  // 사용자 1로 회원가입 및 로그인
  await register(page1, "사용자 1", "user1@mail.com", "validPassword");
  await login(page1, "user1@mail.com", "validPassword");

  // 사용자 2로 회원가입 및 로그인
  await register(page2, "사용자 2", "user2@mail.com", "validPassword");
  await login(page2, "user2@mail.com", "validPassword");

  // 사용자 2의 프로필 페이지로 이동하여 이름 필드를 업데이트합니다.
  await page2.click('button:has-text("Profile")');
  await page2.waitForLoadState("domcontentloaded");

  const updatedName = "사용자 2의 새 이름";
  await page2.fill('input[type="text"]', updatedName);
  await page2.click('button:has-text("Update name")');

  // 프로필 업데이트 상태 코드를 확인합니다.
  const updateResponse = await page2.waitForResponse((response) =>
    response.url().includes("http://localhost:5555/update")
  );
  const updateStatusCode = updateResponse.status();
  console.log("Received Update Status Code:", updateStatusCode);

  // 사용자 1의 프로필 페이지로 이동하여 이름 필드가 업데이트되었는지 확인합니다.
  await page1.click('button:has-text("Profile")');
  await page1.waitForLoadState("domcontentloaded");
  const welcomeMessage1 = await page1.textContent("h2");
  console.log("Welcome Message User1:", welcomeMessage1);

  // 사용자 2의 프로필 페이지로 이동하여 이름 필드가 업데이트되었는지 확인합니다.
  await page2.click('button:has-text("Profile")');
  await page2.waitForLoadState("domcontentloaded");
  const welcomeMessage2 = await page2.textContent("h2");
  console.log("Welcome Message User2:", welcomeMessage2);

  // 사용자 2의 프로필 정보가 올바르게 반환되는지 확인합니다.
  expect(welcomeMessage2).toBe("Welcome, " + updatedName + "!");

  // 사용자 1의 프로필 정보가 올바르게 반환되는지 확인합니다.
  expect(welcomeMessage1).toBe("Welcome, 사용자 1!");
});
