import { test, expect } from "@playwright/test";

test("página inicial exibe título principal", async ({ page }) => {
  await page.goto("/");

  const heading = page
    .getByRole("main")
    .getByRole("heading", { name: "GitHub Analytics" });

  await expect(heading).toBeVisible();
});
