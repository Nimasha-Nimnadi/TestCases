import { test, expect } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.setExtraHTTPHeaders({
    "User-Agent":
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36",
    "Accept-Language": "en-US,en;q=0.9",
  });
  await page.goto("https://onlinelibrary.wiley.com/", {
    waitUntil: "networkidle",
    timeout: 5 * 60000,

  });
});

// Test Subject section accordion functionalities
test("Test subject section accordion expand and content visibility", async ({
  page,
}) => {
  await page
    .getByRole("button", { name: "Agriculture, Aquaculture &" })
    .click();
  await expect(page.getByLabel("Agriculture, Aquaculture &")).toBeVisible();
});

test.describe("Test Login Modal open/close", () => {
  test("Test login model open", async ({ page }) => {
    await page.getByLabel("Log in or Register").click();
    await expect(page.locator("#loginPopupHead")).toContainText(
      "Log in to Wiley Online Library"
    );
    await expect(
      page.getByLabel("Log in to Wiley Online Library").locator("form")
    ).toContainText("Email or Customer ID");
    await page.getByText("Password", { exact: true }).click();
    await expect(
      page.getByLabel("Log in to Wiley Online Library").locator("form")
    ).toContainText("Password");
    await expect(page.getByLabel("Email or Customer ID")).toBeVisible();
    await expect(page.getByPlaceholder("Enter your password")).toBeVisible();
    const loginButton = page.getByRole("button", { name: "Log In" });
    expect(loginButton.isDisabled).toBeTruthy();
  });

  test("Test login model close", async ({ page }) => {
    // open login
    await page.getByLabel("Log in or Register").click();

    // cancel login
    await page.getByLabel("Cancel Login").click();

    await expect(page.locator("#loginPopupHead")).toBeHidden();
  });
});

// Test Login functionality
test.describe("Test Login functionality", () => {
  test("Login with valid credentials", async ({ page }) => {
    // open login model
    await page.getByLabel("Log in or Register").click();

    // click on the email input field
    await page.getByLabel("Email or Customer ID").click();
    // enter email
    await page
      .getByLabel("Email or Customer ID")
      .fill("nimnadinw@gmail.com");

    // click on password input
    await page.getByPlaceholder("Enter your password").click();
    // enter password
    await page.getByPlaceholder("Enter your password").fill("12345Wiley@");

    // Submit login
    await page.getByRole("button", { name: "Log In" }).click();

    await page.waitForLoadState("networkidle");

    // check if user is logged in
    await expect(page.getByText("nimasha")).toBeVisible();
  });

  test("Login with invalid password", async ({ page }) => {
    // open login model
    await page.getByLabel("Log in or Register").click();

    // click on the email input field
    await page.getByLabel("Email or Customer ID").click();
    // enter email
    await page
      .getByLabel("Email or Customer ID")
      .fill("nimnadinw@gmail.com");

    // click on password input
    await page.getByPlaceholder("Enter your password").click();
    // enter password invalid password
    await page.getByPlaceholder("Enter your password").fill("InvalidPassword");

    // Submit login
    await page.getByRole("button", { name: "Log In" }).click();

    // wait for page reload
    await page.waitForLoadState("networkidle");

    await expect(
      page.getByText("Your email or password is incorrect. Please try again.")
    ).toBeVisible();
  });
});
