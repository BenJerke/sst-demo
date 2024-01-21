import { Table } from "sst/node/table";
import handler from "@notes/core/handler";
import dynamoDb from "@notes/core/dynamodb";

export const main = handler(async (event ) => {
    
    const data = JSON.parse(event.body || "{}");
    /*
        "Create an object from a JSON based on event.body, or '{}'."
        Ok... We figure out what userId needs to be based on our auth token in the header. But we're just hardcoding it right now.
        We figure out what the note is based on the event's request parameters. 
        The data we need in order to make our update comes out of the body, and that body could be empty. 
        But if the body's empty, it's just null - that's why we need to do that "or empty json" bit. 
    */  

    const params = {
        TableName: Table.Notes.tableName,
        Key: {
            userId: "123",
            noteId: event?.pathParameters?.id,            
        },
        // this follows the same pattern as the KeyConditionExpression we used earlier. 
        // must be using dynamo db's query language.  
        UpdateExpression: "SET content = :content, attachment = :attachment",
        ExpressionAttributeValues: {
            ":content": data.content || null,
            ":attachment": data.attachment || null,
        },

        // From the guide: 
        // 'ReturnValues' specifies if and how to return the item's attributes,
        // where ALL_NEW returns all attributes of the item after the update; you
        // can inspect 'result' below to see how it works with different settings

        // ok, so setting this means we'll only send the document's updated values back to the client. nice.
        // wait. we're only returning "status true" out of this method, and that's what goes back to the client. 
        // Does this tell our Dynamo DB client which values to write to the database or something? 
        // This is a parameter that gets fed to the ddb client's update method, so it's gotta be something along those lines i guess. 
        ReturnValues: "ALL_NEW",
    };
    // calling back into our dynamoDb defined in our app's core, so we don't have to instantiate a new one on each lambda. 
    // wait. 
    // how does that work? that can't be right. 
    // this is a lambda. it needs to instantiate a dynamo db client. 
    // once we deploy this this thing, how does the lambda know about our code in @notes/code/dynamodb?
    // that must be SST magic at play. it's reading our code, figuring out that this thing needs a dynamo db client based on what we've written, then telling the CDK how to make it all happen when it generates CF templates. ok cool.
    // should look at the actual lambda from the AWS console once we're deployed. 
    await dynamoDb.update(params);

    return JSON.stringify({ status: true });
    
})