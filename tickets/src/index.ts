import mongoose from "mongoose";
import { app } from "./app";
import { natsWrapper } from "./nats-wrapper";
import { OrderCreatedListener } from "./events/listener/order-created-listener";
import { OrdercancelledListener } from "./events/listener/order-cancelled-listener";

const start = async () => {
    console.log("start the application");
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

        new OrderCreatedListener(natsWrapper.client).listen();
        new OrdercancelledListener(natsWrapper.client).listen();

        process.on("SIGINT", () => natsWrapper.client.close());
        process.on("SIGTERM", () => natsWrapper.client.close());
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

app.listen(3002, () => {
    console.log(`Server is listing at 3002!`);
});
start();
