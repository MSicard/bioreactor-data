const request = require(`./lib/request`);
const response = require(`./lib/response`);


async function processEvent(event) {
    try {
        const method = event.httpMethod;
        if (method === `POST`) {
            return await request.processPost(event);
        }

        if (method == `GET`) {
            return await request.processGet(event);
        }
        
        const error = new Error(`Unhandled request method`);
        error.code = `method_not_allowed`;
        throw error;
    } catch (e) {
        console.log(`Error processing event`, e);
        return response.buildErrorResponse(e.code, e.message);
    }
}
exports.handler = async (event) => {
    const result = await processEvent(event);
    return result;
};