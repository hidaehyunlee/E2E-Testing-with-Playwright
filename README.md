# 이대현_QA Engineer Intern 과제

## 1. 개요

---

웹 어플리케이션의 백엔드 코드를 분석하고 **QA 시나리오**를 도출하여 이에 대한 **E2E 테스트 코드**를 작성, **테스트 실행 방법**을 제공합니다.

- **테스트 환경**

  - **Framwork**: Playwright
  - **OS**: macOS Ventura
  - **Browser**: Chromium, Firefox, Webkit
  - **Test Date**: 2023년 7월 25일

- **테스트 폴더 구조**

  ```jsx
  e2e 
  |-- tests (이하의 파일들을 자동으로 테스트)
  |   |-- 1-register.spec.js
  |   |-- 2-login.spec.js
  |   |-- 3-profile.spec.js
  |   |-- 4-update.spec.js
  |   |-- 5-logout.spec.js
  |   |-- 6-authentication.spec.js
  |   |-- test-utils.js (전체 파일에서 유용하게 사용한 객체, 메서드 등 모음)
  |-- ...
  ...
  readme.md (현재 페이지)
  ```

## 2. 테스트 시작하기

---

1. **프로젝트 파일 압축 해제**

2. **모든 패키지 설치** (/root 기준)

   ```bash
   cd frontend && npm install
   cd backend && npm install
   cd e2e && npm install
   ```

3. **root 디렉토리에서 백엔드 서버, 프론트엔드 서버 시작**

   ```bash
   npm start
   ```

4. **e2e 디렉토리**(/e2e)**에서 테스트 실행**

   - 전체 파일 병렬 테스트 명령어

     ```bash
     npx playwright test
     ```

   - 특정 파일 테스트 명령어

     ```bash
     npx playwright test [테스트 파일명]
     ```

     - 테스트 파일은 e2e/tests/ 디렉토리에 위치

   - 특정 브라우저 테스트 명령어

     ```bash
     npx playwright test --project=[브라우저 엔진명]
     ```

     - 브라우저 엔진: chromium, firefox, webkit

5. **Playwright Test Report 에서 테스트 결과 확인**

   - 터미널의 [localhost](http://localhost): 로 접속해 웹 상에서 각 테스트 케이스 에러 확인
   - 테스트 시나리오와 비교

6. **테스트 종료: Ctrl+C 클릭**

## 3. 테스트 시나리오

---

> 해당 테스트 시나리오 표는 `pdf` 파일로 프로젝트 폴더와 함께 압축해 제출했습니다. 혹은 [웹](https://docs.google.com/spreadsheets/d/10K7PVXwcxC2BRIxdCdtQNU5TjViDy009ryKa7KJr57Q/edit?usp=sharing)에서도 확인 가능합니다.

| Category    | TC ID | Test Item   | Pre-Condition                                        | Test Step                                        | Expected Result |
| ----------- | ----- | ----------- | ---------------------------------------------------- | ------------------------------------------------ | --------------- |
| 1. register | 1-1   | 유효한 정보 | 사용자가 유효한 이름, 이메일, 패스워드를 입력한 상태 | 1. name, email, password 필드에 유효한 정보 입력 |                 |

2. Register 버튼 클릭, ('/register' 엔드포인트에 POST 요청) | 1. 회원가입 성공
3. 상태코드 200 반환
4. id, name, email, password 값을 가진 새로운 user 객체 반환 |
   |  | 1-2 | 이미 등록된 이메일 | 입력한 이메일이 이미 세션에 저장되어있는 상태 | 1. TC ID 1-1번 (유효한 정보로 회원가입)
5. 회원가입 된 해당 user 객체의 email로 회원가입 시도 2.1. name, password는 다르게 입력하고 email만 같게 입력
   2.2. Register 버튼 클릭, ('/register' 엔드포인트에 POST 요청) | 1. 회원가입 실패
6. 상태코드 400 반환
7. 에러메세지 "Email already exists"를 반환 |
   |  | 1-3 | 패스워드가 8자 미만인 경우 | 입력한 패스워드가 8자 미만인 상태 | 1. name, email 필드에 유효한 정보 입력
8. password 필드에 8자 미만의 character 입력
9. Register 버튼 클릭, ('/register' 엔드포인트에 POST 요청) | 1. 회원가입 실패
10. 상태코드 400과 반환
11. 에러메세지 "Password should be at least 8 characters long"를 반환 |
    |  | 1-4 | 유효하지 않은 이메일 형식 | (string1)@(string2).(2-3 characters) 과 같은 유효한 이메일이 아닌 형식을 입력한 상태 | 1. 유효하지 않은 이메일 형식("1d!@D6ㅁ") 입력
12. Register 버튼 클릭, ('/register' 엔드포인트에 POST 요청) | 1. 회원가입 성공
13. 상태코드 200 반환3. id, name, email, password 값을 가진 새로운 user 객체 반환 |
    | 2. login | 2-1 | 유효한 정보로 로그인 | 1. 사용자가 유효한 이메일, 패스워드를 입력한 상태 | 1. TC ID 1-1번 (유효한 정보로 회원가입)
14. Log in 필드에 해당 user 객체의 email과 password를 입력
15. Log in 버튼 클릭 ('/login' 엔드포인트에 POST 요청) | 1. 로그인 성공 (passport 인증 성공)
16. 상태코드 200과 사용자 정보 반환
17. 해당 user 객체 세션에 저장 |
    |  | 2-2 | 등록되지 않은 이메일로 로그인 | 사용자가 입력한 이메일을 가진 user 객체가 세션에 존재하지 않는 상태 | 1. 회원가입 하지 않고
18. 유효한 email, password 형식 입력
19. Log in 버튼 클릭 ('/login' 엔드포인트에 POST 요청) | 1. 로그인 실패 (passport 인증 실패)
20. passport: 인증 실패 상태와 "User not found" 에러 메시지 전달3. 서버: 상태코드 400, 에러 메시지 "Login failed" 반환 |
    |  | 2-3 | 패스워드 불일치 | 1. 입력한 이메일이 세션에 존재하는 상태
21. 입력한 패스워드가 user.password와 불일치하는 상태 | 1. TC ID 1-1번 (유효한 정보로 회원가입)
22. Log in 필드에 해당 user 객체의 email 입력 
23. password 필드에 8자 이상의, 회원가입한 정보와 다른 문자를 입력
24. Log in 버튼 클릭 ('/login' 엔드포인트에 POST 요청) | 1. 로그인 실패 
25. passport: 인증 실패 상태와 "Incorrect password" 에러 메시지 전달
26. 서버: 상태코드 400, 에러 메시지 "Login failed" 반환 |
    | 3. profile | 3-1 | 로그인된 사용자의 프로필 조회 | 사용자가 로그인 상태 | 1. TC ID 2-1번 (유효한 정보로 로그인)
27. Profile 버튼 클릭 ('/profile' 엔드포인트에 GET 요청) | 1. 사용자의 프로필 정보가 반환1.1. "Welcome, " + user.name + "!" 으로 set |
    |  | 3-2 | 멀티 로그인 후 프로필 조회 | 1. 사용자1가 로그인 상태
28. 사용자2가 새 탭에서 로그인 상태 | 1. 탭1 에서 TC ID 2-1번 (유효한 정보로 로그인) > 사용자 1 생성, 로그인
29. 탭2 에서 TC ID 2-1번 (유효한 정보로 로그인) > 사용자 2 생성, 로그인
30. 탭1 에서 Profile 버튼 클릭 ('/profile' 엔드포인트에 GET 요청) | 1. 사용자 1의 프로필 조회 실패
31. 사용자 2의 프로필 정보 반환
32. 단일 세션 유지 확인 |
    | 4. update | 4-1 | 로그인된 사용자의 프로필 업데이트 | 사용자가 로그인 상태 | 1. TC ID 2-1번 (유효한 정보로 로그인)
33. name 필드에 30개 이상의 문자 입력
34. Update name 버튼 클릭 ( '/update' 엔드포인트에 POST 요청) | 1. 업데이트된 프로필 정보 반환1.1. "Welcome, " + user.name + "!" 으로 set |
    |  | 4-2 | 업데이트 정보 미입력 | 사용자가 로그인 상태 | 1. TC ID 2-1번 (유효한 정보로 로그인)
35. name 필드를 비워둔 상태로
36. Update name 버튼 클릭 ( '/update' 엔드포인트에 POST 요청) | 1. 업데이트 성공
37. 업데이트된 프로필 정보(빈 문자열) 반환
    2.1. "Welcome, !" 으로 set |
    |  | 4-3 | 멀티 로그인 후 프로필 업데이트 | 1. 사용자가 로그인 상태
38. 사용자 2가 새 탭에서 로그인 상태 | 1. 탭1 에서 TC ID 2-1번 (유효한 정보로 로그인) > 사용자 1 생성, 로그인
39. 탭2 에서 TC ID 2-1번 (유효한 정보로 로그인) > 사용자 2 생성, 로그인
40. 탭2 에서 사용자 2의 이름 필드 "사용자2의 새 이름"으로 입력
41. 탭2 에서 Update name 버튼 클릭 ('/update' 엔드포인트에 GET 요청) | 1. 업데이트된 사용자2의 프로필 정보 반환
42. 탭1의 사용자 1의 name 값도 사용자2 name값으로 업데이트
43. 단일 세션 유지 확인 |
    | 5. logout | 5-1 | 로그아웃 | 사용자가 로그인 상태 | 1. TC ID 2-1번 (유효한 정보로 로그인)
44. Log out 버튼 클릭 ('/logout' 엔드포인트에 GET 요청) | 1. user 객체를 세션에서 삭제
45. 상태코드 200과 메세지 "Logged out"을 반환 |
    |  | 5-2 | 로그아웃 시 홈화면 필드 초기화 | 사용자가 로그인 상태 | 1. TC ID 5-1번 (로그아웃) | Register, Log in 의 input 필드들 빈 칸으로 초기화 |
    | 6. authentication | 6-1 | 새 탭에서 인증 상태 확인 | 사용자가 로그인 상태 | 1. TC ID 2-1번 (유효한 정보로 로그인)
46. 새로운 탭에서 페이지 열기3. 인증된 상태인지 확인을 위해 login api 요청 | 1. 인증 상태 유지
47. 상태코드 200 반환 |
    |  | 6-2 | 새 브라우저 인증 상태 확인 | 사용자가 여러 클라이언트에서 동시에 로그인 상태 | 1. TC ID 2-1번 (유효한 정보로 로그인)
48. 새 브라우저(클라이언트) 열기
49. 해당 계정으로 새 브라우저에서 login api 요청 | 1. 인증 상태 유지
50. 상태코드 200 반환 |
    |  | 6-3 | 새로고침 후 인증 상태 확인 | 사용자가 로그인 상태 | 1. TC ID 2-1번 (유효한 정보로 로그인)
51. 페이지 새로고침 
52. 인증된 상태인지 확인을 위해 login api 요청 | 1. 인증 상태 유지
53. 상태코드 200 반환 |
    |  | 6-4 | 새로고침 후 현재페이지 url 유지 | 사용자가 로그인 상태 | 1. TC ID 2-1번 (유효한 정보로 로그인)
54. 페이지 새로고침
55. profile 페이지 유지되는지 확인 | profile 페이지 유지 |
    |  | 6-5 | 잘못된 엔드포인트 | 서버가 정상 작동 상태 | 존재하지 않는 엔드포인트('/hellohaechi' 엔드포인트에 GET)로 API 호출 | 404 상태코드와 에러메시지 "Not Found" 반환 |

## 4. 테스트 에러 리포트

---

### TC-ID 2-2 및 2-3

```jsx
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
```

- 테스트 목적: passport 미들웨어의 에러 처리 확인
- 결과: 실패. 상태코드 `401` 반환
  - /login API 구현을 보면 `passport.authenticate("local”)` 에서, 인증에 실패한 경우 핸들링을 하지 않고 있습니다.
  - 인증 실패한 경우에도 서버 응답을 보낼 수 있도록 해야합니다.

### TC-ID 3-2 및 4-3

```jsx
test("3-2. 멀티 로그인 후 프로필 조회", async ({ context }) => {
    const page1 = await context.newPage();
    const page2 = await context.newPage();

    // 사용자 1로 회원가입 및 로그인
    const user1 = generateUser("사용자 1", "user1@mail.com", "validPassword");
    await registerAndLogin(page1, user1.name, user1.email, user1.password);
    // 사용자 2로 회원가입 및 로그인
    const user2 = generateUser("사용자 2", "user2@mail.com", "validPassword");
    await registerAndLogin(page2, user2.name, user2.email, user2.password);

    // 사용자 1의 프로필 페이지로 이동
    const welcomeMessage1 = await getWelcomeMessage(page1, "Profile");
    // 사용자 2의 프로필 페이지로 이동
    const welcomeMessage2 = await getWelcomeMessage(page2, "Profile");

    // 사용자 2의 프로필 정보 확인
    expect(welcomeMessage2).toBe(`Welcome, ${user2.name}!`);
    // 사용자 1의 프로필 정보 확인. 
    expect(welcomeMessage1).toBe(`Welcome, ${user1.name}!`);
  });
});
```

- 테스트 목적: 세션이 하나만 유지된다는 것을 확인하기 위한 테스트
- 결과: 확인 가능. 사용자 1의 프로필 정보가 `[user2.name](http://user2.name)` 으로 조회되기 때문에 error 발생

### TC-ID 5-2

```jsx
test("5-2. 로그아웃 시 홈화면 필드 초기화", async ({ page }) => {
    const user = generateUser();
    await registerAndLogin(page, user.name, user.email, user.password);

    await page.click('button:has-text("Log out")');

    await page.waitForResponse((response) =>
      response.url().includes("http://localhost:5555/logout")
    );

    // 루트 페이지 필드들이 초기화 되었는지 확인
    const nameInputValue = await page.inputValue('input[placeholder="Name"]');
    const emailInputValue = await page.inputValue('input[placeholder="Email"]');
    const passwordInputValue = await page.inputValue(
      'input[placeholder="Password"]'
    );

    expect(nameInputValue).toBe("");
    expect(emailInputValue).toBe("");
    expect(passwordInputValue).toBe("");
  });
```

- 테스트 목적: 로그아웃 시 root 페이지 입력필드가 초기화되는지 확인
- 결과: Received: "[1e1zlk@mail.com](mailto:1e1zlk@mail.com)"
  - 로그인 했던 user 객체 정보가 필드에 그대로 남아있습니다.
  - 초기화해주는 코드가 필요합니다.

### TC-ID 6-4

```jsx
test("6-4. 새로고침 후 현재페이지 url 유지", async ({ page }) => {
    const user = generateUser();
    await registerAndLogin(page, user.name, user.email, user.password);

    await page.reload();

    // profile 페이지 유지 확인
    const pageTitle = "Welcome,";
    expect(await page.textContent("h2")).toContain(pageTitle);
  });
```

- 테스트 목적: user가 인증된 상태에서, 새로고침 시 profile 페이지 url이 유지되는지 확인
- 결과:  Expected substring: "Welcome," | Received string: "Register"
  - url이 유지되지 않습니다.
  - 세션이 만료된 것이 아니기때문에 url이 유지되어야 하는데, front/App.js에서 `user ? :` 로 렌더링 하는 방식을 바꿔야 합니다.