import { StackContext, Bucket, Table } from "sst/constructs";

export function StorageStack({ stack }: StackContext) {
    // Create an S3 bucket
    const bucket = new Bucket(stack, "Uploads");

    // Create the DynamoDB table
    const table = new Table(stack, "Notes", {
    fields: {
        userId: "string",
        noteId: "string",
    },
    primaryIndex: { partitionKey: "userId", sortKey: "noteId" },
    });

    // Returning resources allows us to use them in other stacks. 
    return {
        bucket, 
        table,
    };
}