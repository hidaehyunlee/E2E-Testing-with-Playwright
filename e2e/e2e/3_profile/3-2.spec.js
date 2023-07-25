const { test, expect } = require("@playwright/test");
const { register, loginWithResponse, generateUser } = require("../test-utils");

test("인증되지 않은 사용자의 프로필 조회 - 상태 코드 403 확인", async ({
  page,
}) => {
    
  // 인증되지 않은 상태로 프로필 조회를 시도합니다.
  const profileResponse = await page.waitForResponse((response) =>
    response.url().includes("http://localhost:5555/profile")
  );

  // 프로필 조회 상태 코드가 403인지 확인하고 로그로 출력합니다.
  const profileStatusCode = profileResponse.status();
  console.log("Received Profile Status Code:", profileStatusCode);

  // 프로필 조회 상태 코드가 403인지 검증합니다.
  expect(profileStatusCode).toBe(403);

  // 응답 본문을 JSON으로 파싱하여 로그로 출력합니다.
  const responseBody = await profileResponse.json();
  console.log("Received Response Body:", responseBody);

  // 프로필 조회 실패 시 console.error를 출력합니다.
  console.error("Profile retrieval failed");
});
