import { ApiStack } from "./ApiStack";
import * as iam from "aws-cdk-lib/aws-iam";
import { StorageStack } from "./StorageStack";
import { Cognito, StackContext, use } from "sst/constructs";

export function AuthStack({ stack, app }: StackContext){
    // sticking the brackets around the thing = selecting something of the same name from within the import source.
    const { api } = use(ApiStack);
    const { bucket } = use(StorageStack);
    
    // create a new cognito instance on our stack called auth, with a login param set to email. 
    const auth = new Cognito(stack, "Auth", {
        login: ["email"],
    });

    // this Cognito object method gives an authenticated user the following set of permissions: 
    // i guess we need to pass in the stack to get our resource definitions?  
    auth.attachPermissionsForAuthUsers(stack, [
        // so we give it the whole API, plus a policy statement.  
        api,

        new iam.PolicyStatement({
            // this is for any s3 thing i guess? 
            actions: ["s3:*"],
            effect: iam.Effect.ALLOW,                         
            resources: [
                // this gives an authenticated user access to a specific folder in the bucket. 
                // {cognito-identity.amazonaws.com:sub} is the user's federated ID 
                // This ID is assigned by our identity pool, which is abstracted away from the user pool
                // This allows us to swap between authentication providers - the user pool ID can change, but the identity pool id will still know who they are. 
                bucket.bucketArn + "/private/${cognito-identity.amazonaws.com:sub}/*",                
            ],
            
        }),
    ]);

    // put it all back on the stack once we're done. 
    stack.addOutputs({
        Region: app.region,
        UserPoolId: auth.userPoolId,
        UserPoolClientId: auth.userPoolClientId,
        IdentityPoolId: auth.cognitoIdentityPoolId,
    });

    return {
        auth,
    };

}