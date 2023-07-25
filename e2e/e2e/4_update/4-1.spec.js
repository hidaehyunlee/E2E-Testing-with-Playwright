const { test, expect } = require("@playwright/test");
const { register, loginWithResponse, generateUser } = require("../test-utils");

test("로그인된 사용자의 프로필 업데이트", async ({ page }) => {
  // 유효한 정보로 회원가입 및 로그인
  const user = generateUser();
  await register(page, user.name, user.email, user.password);
  await loginWithResponse(page, user.email, user.password);

  // name 필드에 30 characters를 입력하여 프로필 업데이트
  const updatedName = "Updated User Name over 30 characters";

  // 이름 필드의 값을 업데이트합니다.
  await page.fill('input[type="text"]', updatedName);
  await page.click('button:has-text("Update name")');

  // 서버 응답을 기다립니다. (프로필 업데이트 상태 코드 200 확인)
  await page.waitForResponse((response) =>
    response.url().includes("http://localhost:5555/update")
  );

  // 업데이트 된 프로필 정보가 올바르게 반영되었는지 확인합니다.
  const updatedWelcomeMessage = await page.textContent("h2");
  console.log("Updated Welcome Message:", updatedWelcomeMessage);
  expect(updatedWelcomeMessage).toBe("Welcome, " + updatedName + "!");
});
