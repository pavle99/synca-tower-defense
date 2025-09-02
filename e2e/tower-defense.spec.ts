import { test, expect } from "@playwright/test";

test("Tower Defense E2E: Start game, place towers, complete first wave", async ({
  page,
}) => {
  // Navigate to the app (assuming it's running on localhost:5173 in dev mode)
  await page.goto("http://localhost:3000");

  // Verify initial UI elements are present
  await expect(page.getByRole("banner")).toBeVisible(); // HUD
  await expect(page.getByLabel("Tower Defense Game Board")).toBeVisible(); // Canvas
  await expect(page.getByText("Tower Arsenal")).toBeVisible(); // BuildBar

  // Verify initial game state
  await expect(page.getByText("Money")).toBeVisible();
  await expect(page.getByText("Lives")).toBeVisible();
  // await expect(page.getByText('Wave')).toBeVisible();

  // Capture initial money amount
  const initialMoneyText = await page.getByLabel("Money").textContent();
  const initialMoney = parseInt(initialMoneyText?.replace("$", "") || "0");

  // Start the game
  const startButton = page.getByRole("button", { name: /start game/i });
  await expect(startButton).toBeVisible();
  await startButton.click();

  // Verify game is now running by checking for game control buttons
  const pauseButton = page.getByRole("button", { name: /pause game/i });
  const restartButton = page.getByRole("button", { name: /restart game/i });
  await expect(pauseButton).toBeVisible();
  await expect(restartButton).toBeVisible();

  // Select Arrow Tower (key "1")
  await page.keyboard.press("1");

  // Verify tower selection UI appears
  await expect(
    page
      .getByRole("button")
      .filter({ hasText: "Arrow Tower" })
      .filter({ hasText: "Press 1 to select" })
  ).toBeVisible();

  // Click on the canvas to place a tower
  const canvas = page.getByLabel("Tower Defense Game Board");
  await canvas.click({ position: { x: 200, y: 100 } });

  // Place a second tower (Cannon Tower)
  await page.keyboard.press("2");
  await expect(
    page
      .getByRole("button")
      .filter({ hasText: "Cannon" })
      .filter({ hasText: "Press 2 to select" })
  ).toBeVisible();
  await canvas.click({ position: { x: 150, y: 200 } });

  // Place a third tower (Frost Tower)
  await page.keyboard.press("3");
  await expect(
    page
      .getByRole("button")
      .filter({ hasText: "Frost Tower" })
      .filter({ hasText: "Press 3 to select" })
  ).toBeVisible();
  await canvas.click({ position: { x: 250, y: 150 } });

  // Clear selection
  await page.keyboard.press("Escape");

  // Calculate expected money after tower purchases
  // Arrow Tower: $20, Cannon: $40, Frost Tower: $30 = Total: $90
  const expectedMoneyAfterTowers = initialMoney - 90;

  // Wait for the first wave to start and progress
  // Look for wave progress indicators
  await expect(
    page.getByText(/Wave.*in progress/i).or(page.getByText(/Start Wave/i))
  ).toBeVisible({ timeout: 10000 });

  // Speed up the game to 2x to make the test run faster
  await page.getByTestId("speed-toggle").click();

  // Wait for the wave to complete
  // This might take some time as mobs need to be spawned and killed by towers
  await expect(
    page.getByRole("button", { name: /Start early for bonus/i })
  ).toBeVisible({
    timeout: 30000,
  });

  // Verify the game didn't end in defeat
  await expect(page.getByText("Defeat")).not.toBeVisible();

  // Verify money increased from killing mobs
  const finalMoneyText = await page.getByLabel("Money").textContent();
  const finalMoney = parseInt(finalMoneyText?.replace("$", "") || "0");

  // Money should be higher than expected after towers due to mob bounties
  expect(finalMoney).toBeGreaterThan(expectedMoneyAfterTowers);

  // Test some keyboard shortcuts
  await page.keyboard.press("Space"); // Pause
  await page.keyboard.press("Space"); // Resume
  await page.keyboard.press("s"); // Speed toggle
  await page.keyboard.press("F1"); // Help dialog

  // Verify help dialog opened
  await expect(page.getByText("Keyboard Shortcuts")).toBeVisible();
});

test("Tower Defense: Game restart functionality", async ({ page }) => {
  await page.goto("http://localhost:3000");

  // Start the game
  await page.getByRole("button", { name: /start game/i }).click();

  // Wait for game to start
  await expect(
    page.getByRole("button", { name: /restart game/i })
  ).toBeVisible();

  // Click restart
  await page.getByRole("button", { name: /restart game/i }).click();

  // Verify game returned to initial state
  await expect(
    page
      .getByRole("button", { name: /start game/i })
      .or(page.getByRole("button", { name: /resume game/i }))
  ).toBeVisible();
});
