const { test, expect } = require("@playwright/test");

test("잘못된 엔드포인트로 API 호출", async ({ page }) => {
  // Make an API call to a non-existent endpoint '/hello'
  const response = await page.waitForResponse((response) =>
    response.url().includes("http://localhost:5555/hello")
  );

  // Verify that the response status code is 404
  const statusCode = response.status();
  expect(statusCode).toBe(404);

  // Parse the response body to check for the error message
  const responseBody = await response.json();
  expect(responseBody.message).toBe("Not Found");
});
