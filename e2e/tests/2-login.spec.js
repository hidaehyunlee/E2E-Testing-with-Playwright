const { test, expect } = require("@playwright/test");
const { register, login, generateUser } = require("./test-utils");

test.describe("2. Login API 테스트", () => {
  test("2-1. 유효한 정보로 로그인", async ({ page }) => {
    const user = generateUser();
    await register(page, user.name, user.email, user.password);
    const loginResponse = await login(page, user.email, user.password);

    // 상태 코드 200 확인
    const loginStatusCode = loginResponse.status();
    expect(loginStatusCode).toBe(200);
  });

  test("2-2. 등록되지 않은 이메일로 로그인", async ({ page }) => {
    const loginResponse = await login(
      page,
      "unregistered@mail.com",
      "validPassword"
    );

    // 상태 코드가 400 확인
    const loginStatusCode = loginResponse.status();
    expect(loginStatusCode).toBe(400);

    // "User not found" 확인
    const responseBody = await loginResponse.json();
    expect(responseBody.user.email).toBe(generateValidUser().email);
  });

  test("2-3. 패스워드 불일치", async ({ page }) => {
    // 유저 정보 기억하기 위해 값 넣어 생성
    await register(page, "이대현", "hidaehyunlee@gmail.com", "validPassword");

    // password만 다르게 로그인 시도
    const loginResponse = await login(
      page,
      "hidaehyunlee@gmail.com",
      "missmachedPassword"
    );

    const loginStatusCode = loginResponse.status();
    expect(loginStatusCode).toBe(400); // 401

    // "Incorrect password" 확인
    const responseBody = await loginResponse.json();
    expect(responseBody.message).toBe("Incorrect password");
  });
});
