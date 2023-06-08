import mongoose from "mongoose";
import { app } from "./app";
import { natsWrapper } from "./nats-wrapper";
import { OrderCreatedListener } from "./events/Listener/order-created-Listener";
import { OrderCancelledListener } from "./events/Listener/order-cancelled-listener";

const start = async () => {
    console.log("Payments");
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

        new OrderCreatedListener(natsWrapper.client).listen();
        new OrderCancelledListener(natsWrapper.client).listen();
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

app.listen(3005, () => {
    console.log(`Server is listing at 3005!`);
});
start();
