// @ts-check
import { test } from '@playwright/test';
import { user, password, logoutText, searchText, baseURL, filePath } from '../fixtures/constants.js';
import { assertUserNameAndLogoutButton, clickBookStoreApplicationCardAndAssertUrl, clickOnBookStoreAndSearchForBook, assertBookNameInSubtringAndCreateObject, loginAssertUrlAndFillForm, logoutApplication, writeBookDetailsInFile } from '../utility/utils.js';

test.beforeEach(async ({ page }) => {
  // Navigate to the designated page.
  await page.goto(baseURL);      
});

test('Login to book store application and get list of books available for desired search', async ({ page }) => {
  //  Click on Book Store Application card and assert the URL.
  await clickBookStoreApplicationCardAndAssertUrl(page);

  // login and fill form
  await loginAssertUrlAndFillForm(page , user , password);

  // Assert the user name and logout button.
  await assertUserNameAndLogoutButton(page, user, logoutText);

  // Click on Book Store button. Though on UI we are already on Book Store page and search for book.
  await clickOnBookStoreAndSearchForBook(page , searchText);

  // For header cells:
  const bookDetails  = await assertBookNameInSubtringAndCreateObject(page)

  // Write the book details to a JSON file.
  await writeBookDetailsInFile( bookDetails , filePath)

  // Logout from the application.
  await logoutApplication(page)

});