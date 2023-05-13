import expres, { Request, Response } from "express";
import {
    NotFoundError,
    requireAuth,
    NotAuthorizedError,
    BadrequestError,
} from "@rgtix/common";
import { Ticket } from "../models/ticket";

import { natsWrapper } from "../nats-wrapper";
import { TicketUpdatedPublisher } from "../events/publisher/ticket-updated-publisher";

const router = expres.Router();

router.put(
    "/api/tickets/:id",
    requireAuth,
    async (req: Request, res: Response) => {
        const ticket = await Ticket.findById(req.params.id);

        if (!ticket) {
            throw new NotFoundError();
        }

        if (ticket.userId !== req.currentUser!.id) {
            throw new NotAuthorizedError();
        }

        if (ticket.orderId) {
            throw new BadrequestError("Ticket is reserved");
        }

        ticket.set({
            title: req.body.title,
            price: req.body.price,
        });
        await ticket.save();
        await new TicketUpdatedPublisher(natsWrapper.client).publish({
            id: ticket.id,
            title: ticket.title,
            price: ticket.price,
            userId: ticket.userId,
            version: ticket.version,
        });
        res.send(ticket);
    }
);

export { router as updateRoutes };
