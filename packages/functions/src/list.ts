// This endpoint returns all of a user's notes. 
// it's crazy - I basically don't even realize I'm creating lambdas in real time. 

import { Table } from "sst/node/table";
import handler from "@notes/core/handler";
import dynamodb from "@notes/core/dynamodb";

export const main = handler(async (event) => {
    const params = {        
        TableName: Table.Notes.tableName,

        // given the table, here's what data to pull: 
        KeyConditionExpression: "userId = :userId",
        // h
        ExpressionAttributeValues: {
            ":userId": "123", // ok no clue what that's about.
            // wait. this makes sense. 
            // Key Condition Expression = "get records where this expression is true."
            // Expression Attribute Values lets you pass data into the Key Condition Expression. 
            // The expression consists of a field and then a condition - 
            // the field's value must meet the condition
            // to feed variable values into the condition, you specify parameters with the colon.
            // then down here, we bind data to the parameters, which get sent upstairs to the condition. 
            // here, we've simply hardcoded :userId to 123 - the only user in our DB.
        },
    };

    const result = await dynamodb.query(params);
    /* 
    "run a query against our dynamoDb, using params defined above."
    - In our StorageStack, we instantiated a Table.
        - We constructed the table by passing a variable 'stack' of type StackContext, and a string "Notes". 
        - The string became its name
        - we then defined 2 fields for the table: 
            - userId, a string; 
            - and noteId, also a string.
        - we also defined a primaryIndex for our table: 
            - it took a partition key, and a sort key. 
            - both of these were the fields we defined above. 
            - if I read it out in english, I guess what we're saying is something like...
                - "this table is partitioned by userId, and sorted by noteId."
                - I supposed that means, in some sense; we're grouping notes by the users who created them. this makes sense, I guess. 
            - What's that actual data structure look like in Dynamo, though? Question for the docs, I guess...
                - OH HEY. It's a NoSQL database. That should've been obvious. Still unsure about the purpose of partitions and sort keys in this context, but that's for another day.                     
     */
    
    return JSON.stringify(result.Items);

});

