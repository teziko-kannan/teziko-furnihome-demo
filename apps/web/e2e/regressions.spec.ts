import { expect, test, type Page } from "@playwright/test";

/** Regression tests for the QA bug list (numbers refer to that list). */
test.use({ reducedMotion: "reduce" });

async function fillAddress(page: Page) {
  await page.getByLabel("Email").fill("qa@example.com");
  await page.getByLabel("Full name").fill("Ananya Rao");
  await page.getByLabel("Mobile number").fill("9876543210");
  await page.getByLabel("PIN code").fill("560038");
  await page.getByLabel("House no., building, street").fill("12, 4th Cross, Indiranagar");
  await page.getByLabel("City").fill("Bengaluru");
  await page.getByLabel("State").selectOption("Karnataka");
}

test("#1 a registered account can sign out and sign in again", async ({ page }) => {
  const email = `qa${Date.now()}@example.com`;
  await page.goto("/register");
  await page.getByLabel("Full name").fill("Riya Tester");
  await page.getByLabel("Email").fill(email);
  await page.getByLabel("Password").fill("sunshine123");
  await page.getByRole("button", { name: "Create account" }).click();
  await expect(page.getByRole("heading", { name: "Hello, Riya" })).toBeVisible();
  await page.waitForLoadState("networkidle");
  await page.getByRole("button", { name: "Sign out" }).click();
  await page.waitForURL("/", { waitUntil: "commit" });
  await page.goto("/login");
  await page.getByLabel("Email").fill(email);
  await page.getByLabel("Password").fill("wrong-password");
  await page.getByRole("button", { name: "Sign in", exact: true }).click();
  await expect(page.getByRole("alert").filter({ hasText: "incorrect" })).toBeVisible();
  await page.getByLabel("Password").fill("sunshine123");
  await page.getByRole("button", { name: "Sign in", exact: true }).click();
  await expect(page.getByRole("heading", { name: "Hello, Riya" })).toBeVisible();
});

test("#2 forms POST to a fallback and never put fields in the URL", async ({ page, request }) => {
  await page.goto("/contact");
  const forms = await page.$$eval("form", (fs) =>
    fs.map((f) => [f.method, new URL(f.action).pathname]),
  );
  expect(forms.length).toBeGreaterThan(0);
  for (const [method, path] of forms) expect([method, path]).toEqual(["post", "/api/no-js"]);
  const res = await request.post("/api/no-js", {
    form: { email: "a@b.com", password: "secret" },
    headers: { referer: "http://localhost/login" },
    maxRedirects: 0,
  });
  expect(res.status()).toBe(303);
  expect(res.headers()["location"]).not.toContain("secret");
});

test("#3 #9 #15 order URL has no email, declined attempts are not orders, payment label is readable", async ({
  page,
}) => {
  await page.goto("/product/rasoika-750-w-mixer-grinder");
  await page.getByRole("button", { name: "Add to cart" }).click();
  await page.goto("/checkout");
  await fillAddress(page);
  await page.getByRole("button", { name: "Continue to payment" }).click();
  await expect(page.getByText("Taxable value")).toBeVisible();
  await page.getByRole("button", { name: "Continue to pay" }).click();
  await page.getByRole("button", { name: "Simulate failure" }).click();
  await expect(page.getByRole("alert").filter({ hasText: "No order was placed" })).toBeVisible();
  await page.getByLabel(/Cash on delivery/).check();
  await page.getByRole("button", { name: /Place order/ }).click();
  await expect(page.getByRole("heading", { name: /your order is placed/ })).toBeVisible();
  expect(page.url()).not.toMatch(/email|@|%40/);
  await expect(page.getByText("Cash on delivery · Pay when it arrives")).toBeVisible();
  const stored = await page.evaluate(
    () => JSON.parse(localStorage.getItem("tz-data:orders") ?? "[]").length,
  );
  expect(stored).toBe(1);
});

test("#4 address PIN must match the state", async ({ page }) => {
  await page.goto("/product/rasoika-750-w-mixer-grinder");
  await page.getByRole("button", { name: "Add to cart" }).click();
  await page.goto("/checkout");
  await fillAddress(page);
  await page.getByLabel("PIN code").fill("110001");
  await page.getByRole("button", { name: "Continue to payment" }).click();
  await expect(page.getByText(/PIN 110001 is in Delhi, not Karnataka/)).toBeVisible();
});

test("#5 #6 PIN check rejects fake PINs and SKU follows the colour", async ({ page }) => {
  await page.goto("/product/oslo-velvet-3-seater-sofa");
  await page.getByLabel("Check delivery").fill("999999");
  await page.getByRole("button", { name: "Check", exact: true }).click();
  await expect(page.locator("#pincode-result")).toContainText("isn't a valid or serviceable");
  await expect(page.getByText("SKU P004-EMERALD")).toBeVisible();
  await page.getByRole("button", { name: "Midnight Blue" }).click();
  await expect(page.getByText(/SKU P004-MIDNIGHT/)).toBeVisible();
});

test("#7 'fridge' and 'refrigerator' find the same products", async ({ page }) => {
  await page.goto("/shop?q=fridge");
  const a = await page.locator("#results-heading").innerText();
  await page.goto("/shop?q=refrigerator");
  await expect(page.locator("#results-heading")).toHaveText(a);
  expect(a).toBe("4 products");
});

test("#10 compare only accepts products from the same category", async ({ page }) => {
  await page.goto("/product/rasoika-750-w-mixer-grinder");
  await page.getByRole("button", { name: "Compare", exact: true }).first().click();
  await page.goto("/product/lumora-43-4k-qled-smart-tv");
  await page.getByRole("button", { name: "Compare", exact: true }).first().click();
  await expect(page.getByText("Compare products from the same category")).toBeVisible();
});

test("#13 unknown pages return 404 with a 404 title", async ({ request, page }) => {
  for (const path of ["/not-a-real-page", "/category/nope", "/product/not-a-real-sofa"]) {
    const res = await request.get(path);
    expect(res.status(), path).toBe(404);
  }
  await page.goto("/not-a-real-page");
  await expect(page).toHaveTitle(/Page not found/);
});

test("#14 the homepage has exactly one h1", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("h1")).toHaveCount(1);
});
