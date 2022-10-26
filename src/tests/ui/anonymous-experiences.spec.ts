import { test, expect, Page } from '@playwright/test';

let page: Page;

test.beforeAll(async ({ browser }) => {
  page = await browser.newPage({baseURL: 'http://localhost:3000'});
  await page.goto('http://localhost:3000');
});

test.describe('Sample Queries', () => {

  test('Sign in tooltip should be visible', async () => {
    await page
      .locator('[aria-label="Applications has 8 results 2 of 28"] [aria-label="expand collapse group"]')
      .click();
    await expect(page
      // eslint-disable-next-line max-len
      .locator('[aria-label="patchupdate application properties"] div[role="gridcell"]:has-text("Sign in to try this sample")'))
      .toBeVisible();
  });

});

test.describe('Settings', () => {

  test('Change theme settings', async () => {

    const settingsButton = page.locator('[aria-label="Settings"]');
    await settingsButton.click();
    const changeThemeButton = page.locator('button[role="menuitem"]:has-text("Change theme")');
    await changeThemeButton.click();
    await page.locator('text=Dark').click();
    const closeThemeDialogButton = page.locator('button:has-text("Close")');
    await closeThemeDialogButton.click();
    await page.locator('[aria-label="Settings"]').click();
    await changeThemeButton.click();
    await page.locator('text=High contrast').click();
    await closeThemeDialogButton.click();
    await settingsButton.click();
    await changeThemeButton.click();
    await page.locator('text=Light').click();
    await page.locator('text=Close').click();
  });

  test('Get a sandbox with sample data', async () => {
    await page.locator('[aria-label="Settings"]').click();
    // Click text=Get a sandbox with sample data
    const [page1] = await Promise.all([
      page.waitForEvent('popup'),
      page.locator('text=Get a sandbox with sample data').click()
    ]);
  })
})

test.describe('Run query', () => {

  test('user can run query', async () => {
    const runQueryButton = page.locator('.run-query-button button');
    await runQueryButton.click();
    await page.waitForTimeout(100);
    const messageBar = page.locator('.ms-MessageBar-content');
    expect(messageBar).toBeDefined();
  });

});

test.describe('Autocomplete', () => {
  test('Adds message and gets autocomplete options', async () => {

    const queryInputField = page.locator('[aria-label="Query sample input"]');
    await queryInputField.click();

    await queryInputField.type('/mess');
    await page.locator('label:has-text("messages")').click();
    await queryInputField.type('?sel');
    await page.locator('label:has-text("$select")').click();
    await queryInputField.press('Tab');
    await queryInputField.press('Tab');

    // eslint-disable-next-line max-len
    expect('input[aria-label="Query sample input"]:has-text("https://graph.microsoft.com/v1.0/me/messages?$select=id")').toBeDefined()

  });

})

test.describe('Version v1.0/beta', () => {

  test('Changing the version via the dropdown menu changes the version in the request URL field', async () => {
    await page.locator('[aria-label="Microsoft Graph API Version option"] span:has-text("v1.0")').click();
    await page.locator('button[role="option"]:has-text("beta")').click();
    expect('input[aria-label="Query sample input"]:has-text("https://graph.microsoft.com/beta/me")').toBeDefined()

    await page.locator('[aria-label="Microsoft Graph API Version option"] span:has-text("beta")').click();
    await page.locator('button[role="option"]:has-text("v1.0")').click();
    expect('input[aria-label="Query sample input"]:has-text("https://graph.microsoft.com/v1.0/me")').toBeDefined()

  });

  test('Changing the version via the request URL field changes the version in the dropdown', async () => {
    await page.locator('[aria-label="Query sample input"]').fill('https://graph.microsoft.com/beta/me');
    expect('[aria-label="Microsoft Graph API Version option"] span:has-text("beta")').toBeDefined();

    await page.locator('[aria-label="Query sample input"]').fill('https://graph.microsoft.com/v1.0/me');
    expect('[aria-label="Microsoft Graph API Version option"] span:has-text("v1.0")').toBeDefined();

  });

  test.describe('HTTP Methods', () => {
    test('Changing HTTP method works', async () => {
      await page.locator('[aria-label="HTTP request method option"] >> text=GET').click();
      await page.locator('button[role="option"]:has-text("POST")').click();
      await page.locator('[aria-label="HTTP request method option"] >> text=POST').click();
      await page.locator('button[role="option"]:has-text("PUT")').click();
      await page.locator('[aria-label="HTTP request method option"] >> text=PUT').click();
      await page.locator('button[role="option"]:has-text("PATCH")').click();
      await page.locator('[aria-label="HTTP request method option"] >> text=PATCH').click();
      await page.locator('button[role="option"]:has-text("DELETE")').click();
      expect(page.locator('text=Sign in to use this method')).toBeDefined();
    })
  });

  test.describe('Share query', () => {
    test('Should launch the share query dialog when share query button is clicked', async () => {
      await page.locator('[aria-label="Share query"]').click();
      expect(page.locator('div[role="heading"]:has-text("Share Query")')).toBeDefined();
      // eslint-disable-next-line max-len
      expect(page.locator('text=Share this link to let people try your current query in the Graph Explorer')).toBeDefined();
      // eslint-disable-next-line max-len
      expect(page.locator('text=https://developer.microsoft.com/en-us/graph/graph-explorer?request=me&method=GET')).toBeDefined();
      await page.locator('button:has-text("Copy")').click();
      expect(page.locator('button:has-text("Copied")')).toBeDefined();
      await page.locator('button:has-text("Close")').click();
    });
  })

  test.describe('Resources explorer', () => {
    test('Should open the resources explorer when the resources explorer button is clicked', async () => {
      await page.locator('button[role="tab"]:has-text(" Resources")').click();
      await page.locator('text=admin (3)').click();
      await page.locator('text=admin').nth(1).click();
      const queryInputField = page.locator('[aria-label="Query sample input"]');
      await queryInputField.click();
      const queryInputValue = await queryInputField.inputValue();
      expect(queryInputValue).toBe('https://graph.microsoft.com/v1.0/admin');
    });

    test('should isolate a resource when the isolate button is clicked', async () => {
      await page.locator('button[role="tab"]:has-text(" Resources")').click();
      await page.locator('text=admin (3)More actions >> [aria-label="More actions"]').click();
      await page.locator('button[role="menuitem"]:has-text("Isolate")').click();
      await page.locator('button:has-text("Close isolation")').click();
    });

    test('should add a resource to collection', async () => {
      await page.locator('button[role="tab"]:has-text(" Resources")').click();
      await page.locator('text=admin (3)').click();
      await page.locator('text=GETadminMore actions >> [aria-label="More actions"]').click();
      await page.locator('button[role="menuitem"]:has-text("Add to collection")').click();
      await page.locator('[aria-label="Preview collection"]').click();
      const [download] = await Promise.all([
        page.waitForEvent('download'),
        page.locator('button:has-text("Download Postman collection")').click()
      ]);
      expect(download.suggestedFilename().indexOf('postman_collection.json')).toBeGreaterThan(-1);
      await page.locator('[aria-label="select row"]').click();
      await page.locator('button[role="menuitem"]:has-text("Remove")').click();
    });

    test('should switch between v1 and beta versions of resources', async () => {
      await page.locator('button[role="tab"]:has-text(" Resources")').click();
      await page.locator('button[role="switch"]').click();
      expect(page.locator('label:has-text("On")')).toBeDefined();
    })
  });

  test.describe('History tab', () => {
    test('Something ', async () => {
      await page.locator('button[role="button"]:has-text("Run query")').click();
      await page.locator('text= Sample queries Resources History >> [aria-label="More items"]').click();
      await page.locator('button[role="menuitem"]:has-text(" History")').click();
      expect(page.locator('span:has-text("Today")')).toBeDefined();
      const [download] = await Promise.all([
        page.waitForEvent('download'),
        page.locator('[aria-label="Export Today queries"]').click()
      ]);
      console.log('Here it is ', download);
      await page.locator('[aria-label="Delete Today queries"]').click();
      await page.locator('text=Delete all requests in the group : Today').click();
      await page.locator('button:has-text("Delete")').click();
      await page.locator('button[role="button"]:has-text("Run query")').click();
      await page.locator('[aria-label="\\/v1\\.0\\/me\\. Navigate with right arrow key to access"]').click();
    })
  })
})


