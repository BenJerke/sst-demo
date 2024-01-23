import Stripe from "stripe";
import { Config } from "sst/node/config";
import handler from "@notes/core/handler";
import { calculateCost } from "@notes/core/cost";

export const main = handler(async (event) => {
    // this lambda gets hit when our user asks to store a count of notes
    // source is their credit card information. we're taking that, btw. 
    // sooo that's probably gonna need to be encrypted during transmission, huh. 
    const { storage, source } = JSON.parse(event.body || "{}");

    // calculate the cost based on how many notes they want to store
    const amount = calculateCost(storage);
    const description = "Scratch charge";

    // pull our secret key into the lambda
    const stripe = new Stripe(Config.STRIPE_SECRET_KEY, {
        apiVersion: "2023-10-16",
    });

    await stripe.charges.create({
        source, 
        amount, 
        description, 
        currency: "usd",
    });

    return JSON.stringify({ status: true });

})