import { Publisher, OrderCancelledEvent, Subjects } from "@rgtix/common";

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
    subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
}
