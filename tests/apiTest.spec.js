const { test } = require('@playwright/test');
const { createUserAssertResponseAndRetunrUserId, getApiContext, getAndAssertUserDetails, updateUserDetails } = require('../utility/apiUtility');
const { dummeFirstName, dummyLastName, firstName, lastName, apiBaseURL, apiKey, dummyUserId, updatedFirstName, updatedLastName } = require('../fixtures/constants');

test('Automate user API flow on reqres.in', async ({}) => {
    //1 create and get API context 
    const apiContext = await getApiContext(apiBaseURL, apiKey);

    // 1. Create User and assert 201 Response for PUT request and get userId.
    const userId = await createUserAssertResponseAndRetunrUserId(apiContext, firstName, lastName);
    
    // 2. Get Created User and validate first, last name and id and response code
    //As reqres does not save the details so use dummyId if we want to check correctness of the code
    
    await getAndAssertUserDetails(apiContext, userId, firstName, lastName);
    //await getAndAssertUserDetails(apiContext, dummyUserId, dummeFirstName, dummyLastName);

    // 3. Update User and assert respnse
    await updateUserDetails(apiContext, userId , updatedFirstName, updatedLastName);
    //As reqres does not save the details so use dummyId if we want to check correctness of the code
    await getAndAssertUserDetails(apiContext, userId, updatedFirstName, updatedLastName);
    //await getAndAssertUserDetails(apiContext, dummyUserId, dummeFirstName, dummyLastName);

  
});
