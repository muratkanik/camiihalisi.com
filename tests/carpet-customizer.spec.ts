import { test, expect } from '@playwright/test';

test.describe('Carpet Color Customizer', () => {
  
  test('should load color customizer and create mapping', async ({ page }) => {
    // Navigate to a known product page
    await page.goto('/kategori/safli-akrilik-cami-halisi/desen-002');
    
    // Open the color customizer modal
    const openBtn = page.getByRole('button', { name: /Rengi Değiştir/i });
    await expect(openBtn).toBeVisible();
    await openBtn.click();
    
    // Wait for canvas to render and analyze
    await page.waitForTimeout(2000);
    
    // Pick a detected color
    const detectedColorBtn = page.locator('.detected-color-item').first();
    await detectedColorBtn.click();
    
    // Pick a yarn from palette
    const yarnBtn = page.locator('.yarn-item').first();
    await yarnBtn.click();
    
    // Ensure mapping exists
    await expect(page.locator('.mapping-list-item')).toBeVisible();
  });

  test('should save design and create a share link', async ({ page }) => {
    await page.goto('/kategori/safli-akrilik-cami-halisi/desen-002');
    await page.getByRole('button', { name: /Rengi Değiştir/i }).click();
    await page.waitForTimeout(2000);
    
    await page.locator('.detected-color-item').first().click();
    await page.locator('.yarn-item').first().click();
    
    // Click 'Create Link' or 'Link'
    const linkBtn = page.getByRole('button', { name: /Link/i });
    await linkBtn.click();
    
    // API request should be made and a link generated
    // Here we can check if the button becomes a pulse or if URL appears
    // The link is usually copied to clipboard or a toast is shown
  });

  test('should restore design from URL parameter', async ({ page }) => {
    // Using a fake ID for demonstration, in a real scenario you'd intercept the API or seed DB
    await page.route('**/api/carpet-designs*', async route => {
      const json = {
        success: true,
        session: {
          id: 'test-123',
          productSlug: 'desen-002',
          mappings: [
            { sourceColorHex: '#ffffff', targetYarnCode: 'A001', targetYarnNameTr: 'Beyaz' }
          ]
        }
      };
      await route.fulfill({ json });
    });

    await page.goto('/kategori/safli-akrilik-cami-halisi/desen-002?design=test-123');
    
    // Modal should auto open
    await expect(page.locator('.CarpetColorCustomizer-modal')).toBeVisible();
  });

  test('should show restore prompt from LocalStorage', async ({ page }) => {
    // Set local storage
    await page.goto('/kategori/safli-akrilik-cami-halisi/desen-002');
    await page.evaluate(() => {
      localStorage.setItem('carpet_design_draft_desen-002', JSON.stringify({
        productSlug: 'desen-002',
        mappings: [{ sourceColorHex: '#ffffff', targetYarnCode: 'A001' }]
      }));
    });
    
    // Open modal
    page.on('dialog', async dialog => {
      expect(dialog.message()).toContain('geri yüklemek ister misiniz');
      await dialog.accept();
    });

    await page.getByRole('button', { name: /Rengi Değiştir/i }).click();
  });
});
