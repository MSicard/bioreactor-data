const response = require(`./response`);
const bioreactor = require('./bioreactor');

async function processPost(aPostEvent) {
    const resource = aPostEvent.resource.split(`/`).pop();
    const requestBody = JSON.parse(aPostEvent.body);

    if (resource == 'weight') {
        const responseBody = await bioreactor.postWeight(
            requestBody
        );
        
        return response.buildSuccessResponse(`default`, responseBody)
    }

    const error = new Error(`Resource name not found: ${resource}`);
    error.code = `resource_not_found`;
    throw error;
}

async function processGet(aGetEvent) {
    const resource = aGetEvent.resource.split('/').pop();
    const requestBody = JSON.parse(aGetEvent.body);
    const pathParameters = aGetEvent.pathParameters || {};

    if (resource == 'weight') {
        const responseBody = await bioreactor.getValues(requestBody);
        return response.buildSuccessResponse(`default`, responseBody);
    }

    if (resource == '{container}') {
        const responseBody = await bioreactor.getContainerValues(
            pathParameters.container, requestBody
        );
        return response.buildSuccessResponse(`default`, responseBody);
    }

    if (resource == '{restaurant}') {
        const responseBody = await bioreactor.getRestaurantValues(
            pathParameters.restaurant, requestBody
        );

        return response.buildSuccessResponse(`default`, responseBody);
    }

    const error = new Error(`Resource name not found: ${resource}`);
    error.code = `resource_not_found`;
    throw error;
}


module.exports = {
    processPost,
    processGet
};


