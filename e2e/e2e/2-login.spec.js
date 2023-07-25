const { test, expect } = require("@playwright/test");
const { register, login, generateUser } = require("./test-utils");

test.describe("2. Login API 테스트", () => {
  test("2-1. 유효한 로그인", async ({ page }) => {
    const user = generateUser();
    const loginResponse = await register(
      page,
      user.name,
      user.email,
      user.password
    );

    // 로그인 상태 코드가 200인지 확인하고 로그로 출력합니다.
    const loginStatusCode = loginResponse.status();
    expect(loginStatusCode).toBe(200);
  });

  test("2-2. 등록되지 않은 이메일로 로그인", async ({ page }) => {
    const loginResponse = await login(
      page,
      "unregistered@mail.com",
      "validPassword"
    );

    // 로그인 상태 코드가 400인지 확인
    const loginStatusCode = loginResponse.status();
    expect(loginStatusCode).toBe(400);

    // 응답 본문을 JSON으로 파싱하여 로그로 출력합니다.
    const responseBody = await loginResponse.json();
    expect(responseBody.user.email).toBe(generateValidUser().email);
  });

  test("2-3. 패스워드 불일치", async ({ page }) => {
    // 회원가입을 시도합니다.
    await register(page, "이대현", "hidaehyunlee@gmail.com", "validPassword");

    // 로그인을 시도합니다. 이 때 로그인 상태를 유지하며 서버 응답을 기다립니다.
    const loginResponse = await login(
      page,
      "hidaehyunlee@gmail.com",
      "missmachedPassword"
    );

    // 로그인 상태 코드가 400인지 확인하고 로그로 출력합니다.
    const loginStatusCode = loginResponse.status();
    expect(loginStatusCode).toBe(400); // 401

    // 응답 본문을 JSON으로 파싱하여 로그로 출력합니다.
    const responseBody = await loginResponse.json();
    expect(responseBody.message).toBe("Incorrect password");
  });
});
