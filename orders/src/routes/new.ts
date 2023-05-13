import express, { Request, Response } from "express";
import {
    BadrequestError,
    NotFoundError,
    OrderStatus,
    requireAuth,
    validateRequest,
} from "@rgtix/common";
import { body } from "express-validator";
import { natsWrapper } from "../nats-wrapper";
import mongoose from "mongoose";
import { Ticket } from "../models/ticket";
import { Order } from "../models/order";
import { OrderCreatedPublisher } from "../event/publisher/order-created-publisher";

const router = express.Router();

const EXPIRATION_WINDOW_SECONDS = 1 * 60;

router.post(
    "/api/orders",
    requireAuth,
    [
        body("ticketId")
            .not()
            .isEmpty()
            .custom((input: string) => mongoose.Types.ObjectId.isValid(input))
            .withMessage("TicketId is required"),
    ],
    validateRequest,
    async (req: Request, res: Response) => {
        // find the ticket user try to buy out.
        const { ticketId } = req.body;
        const ticket = await Ticket.findById(ticketId);

        if (!ticket) {
            throw new NotFoundError();
        }

        //Make sure this ticket is  not already  reserversed.
        //run querry to look at all orders. Find an order where the ticket
        //is the ticket we just found  *and* the orderstatus is *not* cancelled.
        //If we find an order that means ticket is reserverd.
        const isReserved = await ticket.isReserved();
        if (isReserved) {
            throw new BadrequestError("Ticket is already reserved");
        }

        //calculate the expiration date for this ticket.
        const expiration = new Date();

        expiration.setSeconds(
            expiration.getSeconds() + EXPIRATION_WINDOW_SECONDS
        );
        //build the order save to the database.
        const order = Order.build({
            userId: req.currentUser!.id,
            status: OrderStatus.Created,
            expiresAt: expiration,
            ticket: ticket,
        });
        await order.save();
        await new OrderCreatedPublisher(natsWrapper.client).publish({
            id: order.id,
            version: order.ticket.version,
            status: order.status,
            userId: order.userId,
            expiresAt: order.expiresAt.toISOString(),
            ticket: {
                id: ticket.id,
                price: ticket.price,
            },
        });
        res.status(201).send(order);
    }
);

export { router as createOrderRouter };
