import { Table } from "sst/node/table";
import handler from "@notes/core/handler";
import dynamoDb from "@notes/core/dynamodb";

// we get a typescript error until we specify that this function will return a Promise<string>
export const main = handler(async (event) => {
    const params = {
        TableName: Table.Notes.tableName,
        /*
            Key: the partition key and sort key of the item to be retrived.
                ... what does that mean. 
                - i can see that we're pulling pathParameters out of our event. 
                - our event is defined over in our API stack, and the parameter is defined in the route. 
                - in the route, we say that this function will get triggered when the route's specified endpoint is hit with the specified HTTP request method.
                - I guess "key"
        */
       // Key defines the item we're going to retrieve from the table defined above, based on a user ID and note ID
        Key: {
            userId: "123",
            // these question-marky guys... what's that about? 
            // is that just to say; "hey, if this property is present, check for this next nested ones"?

            noteId: event?.pathParameters?.id
        },
    };

    const result = await dynamoDb.get(params);
    if(!result.Item) {
        throw new Error("Item not found.");
    }
    
    return JSON.stringify(result.Item);    

});