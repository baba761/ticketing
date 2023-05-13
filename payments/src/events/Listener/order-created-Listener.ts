import { Listener, OrderCreatedEvent, Subjects } from "@rgtix/common";
import { Message } from "node-nats-streaming";
import { queueGroupName } from "./queue-group-name";
import { Order } from "../../models/order";

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
    subject: Subjects.OrderCreated = Subjects.OrderCreated;
    queueGroupName = queueGroupName;

    async onMessage(data: OrderCreatedEvent["data"], msg: Message) {
        console.log("OrderCreated/payment:service");
        const order = Order.build({
            id: data.id,
            userId: data.userId,
            price: data.ticket.price,
            status: data.status,
            version: data.version,
        });
        await order.save();
        msg.ack();
    }
}
