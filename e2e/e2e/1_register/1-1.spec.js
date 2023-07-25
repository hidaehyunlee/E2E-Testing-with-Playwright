const { test, expect } = require("@playwright/test");
const { register, loginWithResponse, generateUser } = require("../test-utils");

test("유효한 로그인 - 상태 코드 200 확인", async ({ page }) => {
  // Generate a valid user
  const user = generateUser();

  // Register the user
  await register(page, user.name, user.email, user.password);

  // Login with the registered user
  const loginResponse = await loginWithResponse(
    page,
    user.email,
    user.password
  );

  // Verify that the login response has a 200 status code
  expect(loginResponse.status()).toBe(200);
});
