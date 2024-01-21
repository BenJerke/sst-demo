import * as uuid from "uuid";
import { Table } from "sst/node/table";
import handler from "@notes/core/handler";
import dynamoDb from "@notes/core/dynamodb"; // the above two lines centralize our resource creation - this way, we don't have to instantiate and define them in each stack. 

// we're now making the whole function asynchronous and returning the results to a central HTTP response handler
export const main = handler(async (event) => {
    let data = {
        content: "",
        attachment: "",        
    };
    
    if (event.body != null){
        data = JSON.parse(event.body);
    }

    const params = {
        TableName: Table.Notes.tableName,
        Item: {
            userId: "123",
            noteId: uuid.v1(),
            content: data.content,
            attachment: data.attachment,
            createdAt: Date.now(),
        },
    };


    await dynamoDb.put(params);
    
    return JSON.stringify(params.Item);
    // we're also going to be centralizing our error handling. 
});