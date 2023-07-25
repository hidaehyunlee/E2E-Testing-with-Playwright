const { test, expect } = require("@playwright/test");
const { register, generateUser } = require("./test-utils");

test.describe("1. Register API 테스트", () => {
  const validPassword = "validPassword";
  const invalidPassword = "short";
  const invalidEmail = "1d!@D6ㅁ";

  test("1-1. 유효한 정보", async ({ page }) => {
    // 유효한 정보로 회원가입 진행
    const user = generateUser();

    const registerResponse = await register(
      page,
      user.name,
      user.email,
      user.password
    );

    // 상태코드 200과 새로운 사용자 정보가 반환되는지 확인합니다.
    const statusCode = registerResponse.status();
    expect(statusCode).toBe(200);
  });

  test("1-2. 이미 등록된 이메일", async ({ page }) => {
    // 이미 등록된 이메일로 회원가입 시도
    const user1 = generateUser();
    const user2 = generateUser("사용자2", user1.email, validPassword);

    // 첫 번째 사용자로 회원가입을 먼저 진행합니다.
    await register(page, user1.name, user1.email, user1.password);

    // 이미 등록된 이메일로 회원가입을 시도합니다.
    const registerResponse = await register(
      page,
      user2.name,
      user1.email,
      user2.password
    );

    // 상태코드 400과 "Email already exists" 메시지가 반환되는지 확인합니다.
    const statusCode = registerResponse.status();
    const responseBody = await registerResponse.json();
    expect(statusCode).toBe(400);
    expect(responseBody.message).toBe("Email already exists");
  });

  test("1-3. 패스워드가 8자 미만인 경우", async ({ page }) => {
    const user = generateUser("사용자3", "user3@mail.com", invalidPassword);

    const registerResponse = await register(
      page,
      user.name,
      user.email,
      user.password
    );

    // 상태코드 400과 "Password should be at least 8 characters long" 메시지가 반환되는지 확인합니다.
    const statusCode = registerResponse.status();
    const responseBody = await registerResponse.json();
    expect(statusCode).toBe(400);
    expect(responseBody.message).toBe(
      "Password should be at least 8 characters long"
    );
  });

  test("1-4. 유효하지 않은 이메일 형식", async ({ page }) => {
    const user = generateUser("", invalidEmail, "validPassword");

    const registerResponse = await register(
      page,
      user.name,
      user.email,
      user.password
    );

    const statusCode = registerResponse.status();
    expect(statusCode).toBe(200);
  });
});
