const dynamo = require(`./dynamo`);
const type = require(`./type.js`);
const Container = require(`./container`);

async function postWeight(aItem) {
    try {

        let container = await Container.getAvailableContainer(aItem.container);
        let date = Date.now();
        let lastValue = await dynamo.getItem(process.env.DYNAMO_TABLE_USER_NAME,
            {
                "Type": type.type.lastData,
                "TypeSort": `${type.type.container}#${container.id}`
            }
        );

        let lastItem = {
            Type: type.type.lastData,
            TypeSort:  `${type.type.container}#${container.id}`,
            weight: aItem.weight,
            time: date
        }
        
        let item = {
            type: type.type.data,
            typeSort: date,
            weight: aItem.weight,
            user: aItem.user,
            container: container.name,
            containerid: container.id,
            diffWeight: parseInt(aItem.weight),
            userid: aItem.user.split(' ').join('')
        }

        if (lastValue !== undefined || Object.kets(lastValue) > 0) {
            if (Object.keys(lastValue['Item']).length > 0) {
                let diffValue = aItem.weight - lastValue['Item'].weight;
                if (diffValue > 0) {
                    item.diffWeight = diffValue;
                }
            }
        } else {
            item.diffWeight = aItem.weight;
        }
       
        await dynamo.putItem(process.env.DYNAMO_TABLE_USER_NAME, lastItem);
        await dynamo.putItem(process.env.DYNAMO_TABLE_NAME, item);
        return item;
    } catch(error) {
        throw error;
    }
}

async function getValues(requestBody) {
    let fromDate = requestBody.fromDate;
    let toDate = requestBody.toDate;

    try {
        const aKeyConditionExpression = `#Type = :type and #TypeSort BETWEEN :fromDate AND :toDate`;
        const aExpressionAttributeNames = {
            '#Type': "type",
            "#TypeSort": "typeSort"
        };
        const aExpressionAttributeValues = {
            ":type": type.type.data,
            ":toDate": toDate,
            ":fromDate": fromDate
        };
        
        return await dynamo.queryItem(process.env.DYNAMO_TABLE_NAME, 
            aKeyConditionExpression,
            aExpressionAttributeNames,
            aExpressionAttributeValues,
        );
    } catch (e) {
        console.log(`Error getting all data`, e);
        throw e;
    }
}

async function getContainerValues(container, requestBody) {
    let fromDate = requestBody.fromDate;
    let toDate = requestBody.toDate;

    try {
        const aKeyConditionExpression = `#Type = :type and #TypeSort BETWEEN :fromDate AND :toDate`;
        const aExpressionAttributeNames = {
            '#Type': "type",
            "#TypeSort": "typeSort",
            '#container': "containerid"
        };
        const aExpressionAttributeValues = {
            ":type": type.type.data,
            ":toDate": toDate,
            ":fromDate": fromDate,
            ":container": container
        };

        const aFilterExpression = "#container = :container"
        
        return await dynamo.queryItem(process.env.DYNAMO_TABLE_NAME, 
            aKeyConditionExpression,
            aExpressionAttributeNames,
            aExpressionAttributeValues,
            aFilterExpression
        );
    } catch (e) {
        console.log(`Error getting all data`, e);
        throw e;
    }
}

async function getRestaurantValues(user, requestBody) {
    let fromDate = requestBody.fromDate;
    let toDate = requestBody.toDate;

    try {
        const aKeyConditionExpression = `#Type = :type and #TypeSort BETWEEN :fromDate AND :toDate`;
        const aExpressionAttributeNames = {
            '#Type': "type",
            "#TypeSort": "typeSort",
            '#user': "userid"
        };
        const aExpressionAttributeValues = {
            ":type": type.type.data,
            ":toDate": toDate,
            ":fromDate": fromDate,
            ":user": user
        };

        const aFilterExpression = "#user = :user"
        
        return await dynamo.queryItem(process.env.DYNAMO_TABLE_NAME, 
            aKeyConditionExpression,
            aExpressionAttributeNames,
            aExpressionAttributeValues,
            aFilterExpression
        );
    } catch (e) {
        console.log(`Error getting all data`, e);
        throw e;
    }
}

module.exports = {
    postWeight,
    getValues,
    getContainerValues,
    getRestaurantValues
}