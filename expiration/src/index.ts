import { OrderCreatedListener } from "./events/listeners/order-created-listener";
import { natsWrapper } from "./nats-wrapper";

const start = async () => {
    console.log("expiration");
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
        process.on("SIGINT", () => natsWrapper.client.close());
        process.on("SIGTERM", () => natsWrapper.client.close());
    } catch (error) {
        console.log(error);
    }
};

start();
