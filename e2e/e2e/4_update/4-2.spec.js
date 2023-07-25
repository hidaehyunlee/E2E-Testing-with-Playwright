const { test, expect } = require("@playwright/test");
const { register, loginWithResponse, generateUser } = require("../test-utils");

test("프로필 정보 미입력", async ({ page }) => {
  // 유효한 정보로 회원가입 및 로그인
  const user = generateUser();
  await register(page, null, user.email, user.password);
  await loginWithResponse(page, user.email, user.password);

  // 이름 필드의 값을 입력하지 않고 업데이트
  await page.click('button:has-text("Update name")');

  // 200 상태코드 확인
  const updateResponse = await page.waitForResponse((response) =>
    response.url().includes("http://localhost:5555/update")
  );

  const updateStatusCode = updateResponse.status();

  console.log("Received Update Status Code:", updateStatusCode);
  expect(updateStatusCode).toBe(200);

  // 업데이트 된 프로필 정보가 올바르게 반영되었는지 확인합니다.
  const updatedWelcomeMessage = await page.textContent("h2");
  console.log("Updated Welcome Message:", updatedWelcomeMessage);
  expect(updatedWelcomeMessage).toBe("Welcome, !");
});
