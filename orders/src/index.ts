import mongoose from "mongoose";
import { app } from "./app";
import { natsWrapper } from "./nats-wrapper";
import { TicketCreatedListener } from "./event/listener/ticket-created-listener";
import { TicketUpdatedListener } from "./event/listener/ticket-updated-listener";
import { ExpirationCompleteListener } from "./event/listener/expiration-complete-listener";
import { PaymentCreatedListener } from "./event/listener/payment-created-listener";
const start = async () => {
    if (!process.env.JWT_KEY) {
        throw new Error("JWT_KEY must be defined");
    }
    if (!process.env.MONGO_URI) {
        throw new Error("MONGO_URI must be defined");
    }
    if (!process.env.NATS_URI) {
        throw new Error("NATS_URI must be defined");
    }
    if (!process.env.CLUSTER_ID) {
        throw new Error("CLUSTER_ID must be defined");
    }
    if (!process.env.CLIENT_ID) {
        throw new Error("CLIENT_ID must be defined");
    }

    try {
        await natsWrapper.connect(
            process.env.CLUSTER_ID,
            process.env.CLIENT_ID,
            process.env.NATS_URI
        );
        natsWrapper.client.on("close", () => {
            console.log("NATS connection is closed");
            process.exit();
        });
        process.on("SIGINT", () => natsWrapper.client.close());
        process.on("SIGTERM", () => natsWrapper.client.close());

        //Listening the events
        new TicketCreatedListener(natsWrapper.client).listen();
        new TicketUpdatedListener(natsWrapper.client).listen();
        new ExpirationCompleteListener(natsWrapper.client).listen();
        new PaymentCreatedListener(natsWrapper.client).listen();
    } catch (error) {
        console.log(error);
    }
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to mongodb");
    } catch (error) {
        console.log(error);
    }
};

app.listen(3003, () => {
    console.log(`Server is listing at 3003!`);
});
start();
