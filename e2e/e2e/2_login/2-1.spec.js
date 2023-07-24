const { test, expect } = require("@playwright/test");
const {
  register,
  loginWithResponse,
  generateUser,
} = require("../test-utils");

test("유효한 로그인 - 상태 코드 200 확인", async ({ page }) => {
  // 회원가입을 시도합니다.
  await register(page, "이대현", "hidaehyunlee@gmail.com", "validPassword");

  // 로그인을 시도합니다. 이 때 로그인 상태를 유지하며 서버 응답을 기다립니다.
  const loginResponse = await loginWithResponse(
    page,
    "hidaehyunlee@gmail.com",
    "validPassword"
  );

  // 로그인 상태 코드가 200인지 확인하고 로그로 출력합니다.
  const loginStatusCode = loginResponse.status();
  console.log("Received Login Status Code:", loginStatusCode);

  // 로그인 상태 코드가 200인지 검증합니다.
  expect(loginStatusCode).toBe(200);

  // 응답 본문을 JSON으로 파싱하여 로그로 출력합니다.
  const responseBody = await loginResponse.json();
  console.log("Received Response Body:", responseBody);

  // 로그인에 성공한 경우, 반환된 사용자 정보를 확인합니다.
  expect(responseBody.user.email).toBe(generateUser().email);
});
