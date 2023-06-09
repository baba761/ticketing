import { Subjects, Listener, TicketUpdatedEvent } from "@rgtix/common";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../models/ticket";
import { queueGroupName } from "./queue-group-name";

export class TicketUpdatedListener extends Listener<TicketUpdatedEvent> {
    subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
    queueGroupName = queueGroupName;

    async onMessage(data: TicketUpdatedEvent["data"], msg: Message) {
        const { id, title, price, version } = data;
        console.log("Ticket Updated event");

        const ticket = await Ticket.findByEvent(data);
        if (!ticket) {
            throw new Error("Ticket Not Found");
        }
        ticket.set({
            title,
            price,
        });
        await ticket.save();
        msg.ack();
    }
}
