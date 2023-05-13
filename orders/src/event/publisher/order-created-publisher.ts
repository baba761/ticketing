import { Publisher, OrderCreatedEvent, Subjects } from "@rgtix/common";

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
    subject: Subjects.OrderCreated = Subjects.OrderCreated;
}
