import { Publisher, Subjects, TicketUpdatedEvent } from "@rgtix/common";

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
    subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
}
