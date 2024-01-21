/*
    This handler takes a given lambda as an argument, runs the lambda within a try-catch, and returns a 200 or 500 error depending on the result of its execution.
    This allows us to centralize our error handling, and any other operations we want to run any time a given lambda runs.
    "Yo dawg, I heard you liked lambdas, so I made a lambda for all your lambdas."
*/

import { Context, APIGatewayProxyEvent } from "aws-lambda";

export default function handler(
    // we're feeding you a parameter called 'lambda'
    // the lambda is a variable that contains a function which returns a Promise<string> 
    // this function must have two parameters: 
    // an instance APIGatewayProxyEvent, and an implementation of Context.
    lambda: (evt: APIGatewayProxyEvent, context: Context) => Promise<string>
) {
    return async function (event: APIGatewayProxyEvent, context: Context){
        let body, statusCode;

        try {
            body = await lambda(event, context);
            statusCode = 200;
        } catch (error) {
            statusCode = 500;
            body = JSON.stringify({
                // ugh, ternaries... 
                // "if the error we catch is an instance of an Error object, set this property value to that error's message property value."
                // otherwise, make whatever we get into a string and use that instead
                error: error instanceof Error ? error.message : String(error),
            });
        }
        return {
            body, 
            statusCode,
        }
    }
}