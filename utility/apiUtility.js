const { request, expect } = require('@playwright/test');

async function getApiContext(url , key) {
    return await request.newContext({
        baseURL: url,
        extraHTTPHeaders: {
            'x-api-key': key 
        }
    });
}

async function createUserAssertResponseAndRetunrUserId(apiContext , first_name , last_name) {
    const createResp = await apiContext.post('https://reqres.in/api/users', {
        data: { first_name , last_name }
    });
    // Assert the response status code
    expect(createResp.status()).toBe(201);
    const createBody = await createResp.json();
    const userId = createBody.id;
    // Assert that userId is present
    expect(userId).toBeTruthy();
    return userId;
}

async function updateUserDetails(apiContext , id , first_name , last_name) {
    const updateResp = await apiContext.put(`https://reqres.in/api/users/${id}`, {
        data: { first_name, last_name }
    });

    // Assert the response status code and response body
    expect(updateResp.status()).toBe(200);
    const resBody = await updateResp.json();
    expect(resBody.first_name).toBe(first_name)
    expect(resBody.last_name).toBe(last_name);
}


async function getAndAssertUserDetails(apiContext, id, first_name , last_name ) {
    const getResp = await apiContext.get(`https://reqres.in/api/users/${id}`);
    // Assert the response status code
    expect(getResp.status()).toBe(200); 
    const userResponse = await getResp.json();
    // Assert the user details
    expect(userResponse['data'].first_name).toBe(first_name)
    expect(userResponse['data'].last_name).toBe(last_name);
}

module.exports = {
    getApiContext,
    createUserAssertResponseAndRetunrUserId,
    getAndAssertUserDetails,
    updateUserDetails
}
