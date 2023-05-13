import { Subjects, Listener, PaymentCreated, OrderStatus } from "@rgtix/common";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../models/ticket";
import { queueGroupName } from "./queue-group-name";
import { Order } from "../../models/order";

export class PaymentCreatedListener extends Listener<PaymentCreated> {
    subject: Subjects.PaymentCreated = Subjects.PaymentCreated;

    queueGroupName = queueGroupName;

    async onMessage(data: PaymentCreated["data"], msg: Message) {
        const order = await Order.findById(data.orderId);
        if (!order) {
            throw new Error("Order not found");
        }
        order.set({
            status: OrderStatus.Complete,
        });

        await order.save();

        msg.ack();
    }
}
