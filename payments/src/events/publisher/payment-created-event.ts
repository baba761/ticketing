import { Publisher, Subjects, PaymentCreated } from "@rgtix/common";

export class PaymentCreatedPublisher extends Publisher<PaymentCreated> {
    subject: Subjects.PaymentCreated = Subjects.PaymentCreated;
}
