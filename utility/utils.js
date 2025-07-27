const { expect } = require("playwright/test");
const { loginUrl, bookStoreURL, bookStoreText, userNamePlaceholder, passwordPlaceholder, searchPlaceHolderText, searchText } = require("../fixtures/constants");
const { card_class, login , userNameValue, submit, headerCells, bodyCells } = require("./selectors");

/**
 * Clicks on the Book Store Application card and verifies the URL.
 * @param {import('@playwright/test').Page} page - The Playwright page object.
 */
async function clickBookStoreApplicationCardAndAssertUrl(page) {
    const bookStoreDiv = page.locator('div.'+card_class).filter({ hasText: bookStoreText });
    bookStoreDiv.click();
    // Verify the URL after clicking the Book Store Application card.
    await expect(page).toHaveURL(bookStoreURL);
}

/**
 * Logs into the application, asserts the URL, and fills the login form.
 * @param {import('@playwright/test').Page} page - The Playwright page object.
 * @param {string} user - The username.
 * @param {string} password - The password.
 */
async function loginAssertUrlAndFillForm(page , user , password) {
    const loginButton = page.locator(login)
    loginButton.click();
    await expect(page).toHaveURL(loginUrl);
    // Verify we have login form visible
    await expect(page.getByPlaceholder(userNamePlaceholder)).toBeVisible();
    await expect(page.getByPlaceholder(passwordPlaceholder)).toBeVisible();

    // fill the login form
    await page.getByPlaceholder(userNamePlaceholder).fill(user);
    await page.getByPlaceholder(passwordPlaceholder).fill(password);

    // click the login button
    await loginButton.click();
}

/**
 * Asserts that the user name and logout button are displayed correctly.
 * @param {import('@playwright/test').Page} page - The Playwright page object.
 * @param {string} user - The username to expect.
 * @param {string} logoutText - The logout button text to expect.
 */
async function assertUserNameAndLogoutButton(page, user, logoutText) {
    // Verify User Name is displayed correctly
    await expect(page.locator(userNameValue)).toHaveText(user);

    // Verify the logout button is visible and has the correct text.
    const logoutButton = page.locator(submit);
    await expect(logoutButton).toBeVisible();
    await expect(logoutButton).toHaveText(logoutText);
}

/**
 * Clicks on the Book Store tab and searches for a book using the provided text.
 * @param {import('@playwright/test').Page} page - The Playwright page object.
 * @param {string} searchText - The search text to use.
 */
async function clickOnBookStoreAndSearchForBook(page , searchText) {
    await page.getByText(/^Book Store$/).click();
    // Search for a book
    page.getByPlaceholder(searchPlaceHolderText).fill(searchText);
}

/**
 * Extracts text content from table cells, excluding any that contain image or are empty.
 * @param {import('@playwright/test').Page} page - The Playwright page object.
 * @param {string} cellSelector - The selector for the table cells.
 * @returns {Promise<string[]>} Filtered cell values.
 */
async function extractTextCellsWithoutImage(page, cellSelector) {
  return await page.$$eval(cellSelector, cells =>
    // scenario which can be improved : 
    // If there is empty row in any cell then our code will fail and its a mandate that 
    // Author, title and Publisher would be displayed in row and they are not empty.
    cells
      .filter(cell => !cell.querySelector('Image') && cell.textContent.trim().length > 0) // Exclude if contains <img>
      .map(cell => cell.textContent.trim())
  );
}

/**
 * Extracts header texts except those whose content is "Image".
 * @param {import('@playwright/test').Page} page - The Playwright page object.
 * @param {string} cellSelector - The selector for header cells.
 * @returns {Promise<string[]>} Filtered header values.
 */
async function extractHeaderCellsWithoutImage(page, cellSelector) {
  return await page.$$eval(cellSelector, cells =>
    cells
      .filter(cell => cell.textContent.trim() != "Image") // Exclude if contains <img>
      .map(cell => cell.textContent.trim())
  );
}

/**
 * Retrieves header cell values (excluding "Image").
 * @param {import('@playwright/test').Page} page - The Playwright page object.
 * @returns {Promise<string[]>} Header cell values.
 */
async function getHeaderCells(page) {
    return await extractHeaderCellsWithoutImage(page, headerCells)
}

/**
 * Retrieves body cell values (excluding empty and image cells).
 * @param {import('@playwright/test').Page} page - The Playwright page object.
 * @returns {Promise<string[]>} Body cell values.
 */
async function getBodyCells(page) {
    return await extractTextCellsWithoutImage(page, bodyCells);
}

/**
 * Extracts and asserts book data: checks if each book title contains the search text, and returns an array of row objects.
 * @param {import('@playwright/test').Page} page - The Playwright page object.
 * @returns {Promise<Object[]>} Array of book objects (per row).
 * @throws Will throw if any "Title" cell does NOT contain the `searchText`.
 */
async function assertBookNameInSubtringAndCreateObject(page){
    const booksHeaders = await getHeaderCells(page);
    const booksValues = await getBodyCells(page);

    const result = [];
    const requiredSubstringForBooks = searchText;
    const titleIndex = booksHeaders.indexOf('Title');
    const chunkSize = booksHeaders.length;

    for (let i = 0; i < booksValues.length; i += chunkSize) {
        const rowValues = booksValues.slice(i, i + chunkSize);
        // Only check substring for head_1
        const titleValue = rowValues[titleIndex];
        if (!String(titleValue).includes(requiredSubstringForBooks)) {
            throw new Error(`Value "${titleValue}" for header "Title" does not contain required substring "${requiredSubstringForBooks}"`);
        }
        // Assemble the row object
        const rowObject = {};
        booksHeaders.forEach((booksHeaders, idx) => {
            rowObject[booksHeaders] = rowValues[idx];
        });
        result.push(rowObject);
    }
    return result;
}

/**
 * Clicks the logout button to log out of the application.
 * @param {import('@playwright/test').Page} page - The Playwright page object.
 */
async function logoutApplication(page) {
    // Click on the logout button.          
    const logoutButton = page.locator(submit);
    await logoutButton.click();
}

/**
 * Writes book details to a file in JSON format.
 * @param {Object[]} bookDetails - Book detail objects to write.
 * @param {string} filePath - The destination file path.
 */
async function writeBookDetailsInFile(bookDetails, filePath) {
    const fs = require('fs');
    fs.writeFileSync(filePath, JSON.stringify(bookDetails, null, 2));
}

module.exports = {
  clickBookStoreApplicationCardAndAssertUrl,
  loginAssertUrlAndFillForm,
  assertUserNameAndLogoutButton,
  clickOnBookStoreAndSearchForBook,
  assertBookNameInSubtringAndCreateObject,
  writeBookDetailsInFile,
  logoutApplication
};