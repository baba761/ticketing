import expres, { Request, Response } from "express";
import { body } from "express-validator";
import {
    NotFoundError,
    requireAuth,
    NotAuthorizedError,
    OrderStatus,
} from "@rgtix/common";

import { natsWrapper } from "../nats-wrapper";
import { Order } from "../models/order";
import { OrderCancelledPublisher } from "../event/publisher/order-cancelled-publisher";

const router = expres.Router();

router.delete(
    "/api/orders/:id",
    requireAuth,
    async (req: Request, res: Response) => {
        const order = await Order.findById(req.params.id).populate("ticket");

        if (!order) {
            throw new NotFoundError();
        }

        if (order.userId !== req.currentUser!.id) {
            throw new NotAuthorizedError();
        }

        order.status = OrderStatus.Cancelled;
        await order.save();
        await new OrderCancelledPublisher(natsWrapper.client).publish({
            id: order.id,
            version: order.ticket.version,
            ticket: {
                id: order.ticket.id,
            },
        });

        res.status(204).send(order);
    }
);

export { router as deleteOrderRoutes };
