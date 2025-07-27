const { request, expect } = require('@playwright/test');

/**
 * Creates a Playwright API request context with a custom base URL and API key header.
 * 
 * @param {string} url - The base URL for API requests.
 * @param {string} key - The API key value to use in the 'x-api-key' header.
 * @returns {Promise<APIRequestContext>} - A Playwright API request context initialized with baseURL and API key header.
 */
async function getApiContext(url, key) {
    return await request.newContext({
        baseURL: url,
        extraHTTPHeaders: {
            'x-api-key': key 
        }
    });
}

/**
 * Creates a user via the reqres.in API, asserts the response, and returns the user ID.
 * 
 * @param {APIRequestContext} apiContext - The Playwright API request context.
 * @param {string} first_name - The user's first name.
 * @param {string} last_name - The user's last name.
 * @returns {Promise<string>} - The ID of the created user.
 */
async function createUserAssertResponseAndRetunrUserId(apiContext, first_name, last_name) {
    const createResp = await apiContext.post('https://reqres.in/api/users', {
        data: { first_name, last_name }
    });
    // Assert the response status code
    expect(createResp.status()).toBe(201);
    const createBody = await createResp.json();
    const userId = createBody.id;
    // Assert that userId is present
    expect(userId).toBeTruthy();
    return userId;
}

/**
 * Updates the user's details via the reqres.in API and asserts the response.
 * 
 * @param {APIRequestContext} apiContext - The Playwright API request context.
 * @param {string} id - The user ID to update.
 * @param {string} first_name - The new first name.
 * @param {string} last_name - The new last name.
 */
async function updateUserDetails(apiContext, id, first_name, last_name) {
    const updateResp = await apiContext.put(`https://reqres.in/api/users/${id}`, {
        data: { first_name, last_name }
    });

    // Assert the response status code and response body
    expect(updateResp.status()).toBe(200);
    const resBody = await updateResp.json();
    expect(resBody.first_name).toBe(first_name);
    expect(resBody.last_name).toBe(last_name);
}

/**
 * Fetches a user's details by ID and asserts the first and last name.
 * 
 * @param {APIRequestContext} apiContext - The Playwright API request context.
 * @param {string} id - The user ID to fetch.
 * @param {string} first_name - The expected first name.
 * @param {string} last_name - The expected last name.
 */
async function getAndAssertUserDetails(apiContext, id, first_name, last_name) {
    const getResp = await apiContext.get(`https://reqres.in/api/users/${id}`);
    // Assert the response status code
    expect(getResp.status()).toBe(200); 
    const userResponse = await getResp.json();
    // Assert the user details
    expect(userResponse['data'].first_name).toBe(first_name);
    expect(userResponse['data'].last_name).toBe(last_name);
}

module.exports = {
    getApiContext,
    createUserAssertResponseAndRetunrUserId,
    getAndAssertUserDetails,
    updateUserDetails
};
