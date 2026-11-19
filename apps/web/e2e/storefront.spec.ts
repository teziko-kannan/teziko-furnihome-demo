import { expect, test, type Page } from "@playwright/test";

async function fillAddress(page: Page) {
  await page.getByLabel("Email").fill("shopper@example.com");
  await page.getByLabel("Full name").fill("Ananya Rao");
  await page.getByLabel("Mobile number").fill("9876543210");
  await page.getByLabel("PIN code").fill("560038");
  await page.getByLabel("House no., building, street").fill("12, 4th Cross, Indiranagar");
  await page.getByLabel("City").fill("Bengaluru");
  await page.getByLabel("State").selectOption("Karnataka");
  await page.getByRole("button", { name: "Continue to payment" }).click();
}

test.describe("storefront", () => {
  test.use({ reducedMotion: "reduce" });

  test("home renders key sections and demo notice", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { name: "Rooms that gather people" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "New arrivals" })).toBeVisible();
    await expect(page.getByText("Demo store. Orders are not real.").first()).toBeVisible();
  });

  test("filters are synced to the URL", async ({ page }) => {
    await page.goto("/home-appliances");
    await page.getByRole("checkbox", { name: /Lumora/ }).click();
    await expect(page).toHaveURL(/brand=lumora/);
    await expect(page.getByText("4 products")).toBeVisible();
    await page.getByLabel("Sort by").selectOption("price-asc");
    await expect(page).toHaveURL(/sort=price-asc/);
  });

  test("add to cart, apply coupon and complete a simulated UPI payment", async ({ page }) => {
    await page.goto("/product/arden-3-seater-fabric-sofa");
    await page.getByRole("button", { name: "Add to cart" }).click();
    const drawer = page.getByRole("dialog");
    await expect(drawer.getByText("Arden 3-Seater Fabric Sofa")).toBeVisible();
    await drawer.getByLabel("Coupon code").fill("WELCOME10");
    await drawer.getByRole("button", { name: "Apply" }).click();
    await expect(drawer.getByText("WELCOME10 applied")).toBeVisible();
    await drawer.getByRole("link", { name: "Checkout" }).click();

    await fillAddress(page);
    await page.getByRole("button", { name: "Continue to pay" }).click();
    await page.getByRole("button", { name: "Simulate success" }).click();

    await expect(page.getByRole("heading", { name: /your order is placed/ })).toBeVisible();
    await expect(page.getByText(/TZ-\d{6}-[A-Z0-9]{4}/).first()).toBeVisible();
    await expect(page.getByText("Coupon WELCOME10")).toBeVisible();
  });

  test("simulated payment failure keeps the cart", async ({ page }) => {
    await page.goto("/product/rasoika-750-w-mixer-grinder");
    await page.getByRole("button", { name: "Add to cart" }).click();
    await page.goto("/checkout");
    await fillAddress(page);
    await page.getByRole("button", { name: "Continue to pay" }).click();
    await page.getByRole("button", { name: "Simulate failure" }).click();
    await expect(page.getByRole("alert").filter({ hasText: "declined" })).toBeVisible();
    await page.goto("/cart");
    await expect(page.getByText("Rasoika 750 W Mixer Grinder")).toBeVisible();
  });

  test("account pages require sign in and show seeded demo orders", async ({ page }) => {
    await page.goto("/account");
    await expect(page).toHaveURL(/\/login\?next=%2Faccount/);
    await page.getByRole("button", { name: /customer@demo.com/ }).click();
    await page.getByRole("button", { name: "Sign in" }).click();
    await expect(page.getByRole("heading", { name: "Hello, Demo" })).toBeVisible();
    await page.getByRole("link", { name: "My orders" }).click();
    await expect(page.getByText(/TZ-\d{6}/).first()).toBeVisible();
  });

  test("order API recomputes totals and ignores client amounts", async ({ request }) => {
    const res = await request.post("/api/orders", {
      data: {
        email: "api@example.com",
        address: {
          fullName: "Test User",
          phone: "9876543210",
          line1: "1 Test Street",
          city: "Pune",
          state: "Maharashtra",
          pincode: "411001",
        },
        lines: [{ productId: "p001", sku: "P001-ASH-GREY", quantity: 1 }],
        paymentMethod: "cod",
        simulateOutcome: "success",
        total: 1,
        pricing: { total: 1 },
      },
    });
    expect(res.status()).toBe(201);
    const json = (await res.json()) as { order: { pricing: { total: number } } };
    expect(json.order.pricing.total).toBe(42999);
  });

  test("honeypot submissions are silently dropped", async ({ request }) => {
    const res = await request.post("/api/newsletter", {
      data: { email: "bot@example.com", website: "http://spam" },
    });
    expect(res.status()).toBe(200);
    expect(((await res.json()) as { id?: string }).id).toBeUndefined();
  });

  test("unknown routes show the 404 page", async ({ page }) => {
    const res = await page.goto("/this-does-not-exist/at-all");
    expect(res?.status()).toBe(404);
    await expect(page.getByRole("heading", { name: "This room is empty" })).toBeVisible();
  });
});

test.describe("mobile @mobile", () => {
  test.use({ reducedMotion: "reduce" });

  test("mobile filters drawer and menu work without horizontal overflow @mobile", async ({
    page,
  }) => {
    await page.goto("/furniture");
    await page.getByRole("button", { name: /^Filters/ }).click();
    await expect(page.getByRole("heading", { name: "Filter products" })).toBeVisible();
    await page.getByRole("button", { name: /Show \d+ results/ }).click();
    await page.getByRole("button", { name: "Open menu" }).click();
    await expect(page.getByRole("navigation", { name: "Mobile" })).toBeVisible();
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - window.innerWidth,
    );
    expect(overflow).toBeLessThanOrEqual(0);
  });
});
