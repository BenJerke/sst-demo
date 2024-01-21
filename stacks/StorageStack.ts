import { StackContext, Bucket, Table } from "sst/constructs";

export function StorageStack({ stack }: StackContext) {
    // Create a generic bucket
    const bucket = new Bucket(stack, "Uploads");

    // Create a generic table
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