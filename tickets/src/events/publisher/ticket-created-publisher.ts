import { Publisher, Subjects, TicketCreatedEvent } from "@rgtix/common";

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
    subject: Subjects.TicketCreated = Subjects.TicketCreated;
}
