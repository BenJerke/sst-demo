import { Api, Config, StackContext, use } from "sst/constructs";
import { StorageStack } from "./StorageStack";

// An abstract definition of our API - we define routes, methods, and bind them to other stack export resources here, but we don't have to specify an implementation.
export function ApiStack({ stack }: StackContext) {
    const { table } = use(StorageStack);
    // secret is an abstraction for something in the AWS secrets manager I guess
    // sooo how did running sst secrets send my stuff into the secrets manager? 
    // does it just do it all based on my IAM user? 
    const STRIPE_SECRET_KEY = new Config.Secret(stack, "STRIPE_SECRET_KEY");

    // Create the API
    const api = new Api(stack, "Api", {
        defaults: {
            authorizer: "iam",
            function: {
                // this allows our API to use our DynamoDB table
                bind: [table, STRIPE_SECRET_KEY],
            },
        },
        routes: { 
            // here's where we define our routes from our API to our Lambdas:
            // "<HTTP method>": "<function file.function name>"

            // NOTES

            // get note by uuid
            "GET /notes/{id}": "packages/functions/src/get.main",

            // get list of notes for authenticated user
            "GET /notes": "packages/functions/src/list.main",
            // create a new note
            "POST /notes": "packages/functions/src/create.main",

            // update a note
            "PUT /notes/{id}":"packages/functions/src/update.main",

            // delete a note
            "DELETE /notes/{id}":"packages/functions/src/delete.main",

            // BILLING 
            "POST /billing": "packages/functions/src/billing.main"
        },
    });

    // Show the API endpoint in the output
    // 
    stack.addOutputs({
    ApiEndpoint: api.url,
    });

    // Return the API resource (allow other stacks to use it)
    return {
        api,
    };
}