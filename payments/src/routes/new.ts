import crypto from "crypto";
import express, { Request, Response } from "express";
import { body } from "express-validator";
import {
    validateRequest,
    BadrequestError,
    NotAuthorizedError,
    NotFoundError,
    OrderStatus,
    requireAuth,
} from "@rgtix/common";
import Razorpay from "razorpay";
import { Order } from "../models/order";
import { Payment } from "../models/payment";
import { PaymentCreatedPublisher } from "../events/publisher/payment-created-event";
import { natsWrapper } from "../nats-wrapper";

const router = express.Router();

router.post(
    "/api/payments",
    requireAuth,
    [body("orderId").not().isEmpty().withMessage("orderId is required")],
    validateRequest,
    async (req: Request, res: Response) => {
        const { orderId } = req.body;

        const order = await Order.findById(orderId);

        if (!order) {
            throw new NotFoundError();
        }
        if (order.userId !== req.currentUser?.id) {
            throw new NotAuthorizedError();
        }
        if (order.status === OrderStatus.Cancelled) {
            throw new BadrequestError("Can't pay for cancelled order");
        }

        const payment = Payment.build({
            orderId,
            stripeId: "stripe_id",
        });
        await payment.save();
        await new PaymentCreatedPublisher(natsWrapper.client).publish({
            id: payment.id,
            stripeId: payment.stripeId,
            orderId: payment.orderId,
        });

        res.send({
            success: true,
        });
    }
);

// router.post(
//     "/api/payments/paymentverification",
//     async (req: Request, res: Response) => {
//         const {
//             razorpay_order_id,
//             razorpay_payment_id,
//             razorpay_signature,
//             orderId,
//         } = req.body;

//         const body = razorpay_order_id + "|" + razorpay_payment_id;
//         console.log(body);
//         const expectedSignature = crypto
//             .createHmac("sha256", "N9SuTubS3WtmQ2aS0KhK5fCS")
//             .update(body.toString())
//             .digest("hex");

//         const isAuthentic = expectedSignature === razorpay_signature;
//         const order = await Order.findById(orderId);

//         if (!order) {
//             throw new NotFoundError();
//         }
//         if (order.userId !== req.currentUser?.id) {
//             throw new NotAuthorizedError();
//         }
//         if (order.status === OrderStatus.Cancelled) {
//             throw new BadrequestError("Can't pay for cancelled order");
//         }

//         if (isAuthentic) {
//             // Database comes here

//             const payment = Payment.build({
//                 orderId,
//                 stripeId: razorpay_payment_id,
//             });
//             await payment.save();
//             // await new PaymentCreatedPublisher(natsWrapper.client).publish({
//             //     id: payment.id,
//             //     stripeId: payment.stripeId,
//             //     orderId: payment.orderId,
//             // });
//             res.redirect(
//                 `https://ticketing.com/payment/${razorpay_payment_id}`
//             );
//         } else {
//             res.status(400).json({
//                 success: false,
//             });
//         }
//     }
// );

// router.post(
//     "/api/payments/postTranscation",
//     async (req: Request, res: Response) => {
//         const { razorpay_payment_id, razorpay_order_id, razorpay_signature } =
//             req.body;
//         console.log(razorpay_order_id);
//         const hmac = crypto.createHmac("sha256", "N9SuTubS3WtmQ2aS0KhK5fCS");
//         hmac.update(razorpay_order_id + "|" + razorpay_payment_id);
//         let generatedSignature = hmac.digest("hex");
//         let isSignatureValid = generatedSignature == razorpay_signature;

//         if (isSignatureValid) {
//             console.log("OK");
//             res.json({
//                 sucess: true,
//                 razorpay_order_id,
//                 razorpay_payment_id,
//                 razorpay_signature,
//             });
//             //do something
//             //res.redirect(307, "https://ticketing.com/");
//         } else {
//             res.status(500).json({ sucess: false });
//         }
//     }
// );

// router.post("/api/payments/razorpay", async (req: Request, res: Response) => {
//     const { amount, orderId } = req.body;
//     var instance = new Razorpay({
//         key_id: "rzp_test_8lXasmIbDSbNs8",
//         key_secret: "N9SuTubS3WtmQ2aS0KhK5fCS",
//     });

//     var options = {
//         amount: amount * 100, // amount in the smallest currency unit
//         currency: "INR",
//     };
//     instance.orders.create(options, function (err, order) {
//         if (err) {
//             return res.json({ success: false, error: err });
//         }
//         res.json({ success: true, id: order.id, amount: order.amount });
//     });
// });

// router.post("/api/payments/verify", async (req: Request, res: Response) => {
//     const check = Razorpay.validateWebhookSignature(
//         JSON.stringify(req.body),
//         req.headers["x-razorpay-signature"],
//         ''
//     );
//     if (check) {
//         //save data in database and this data provide you payment status and payment details
//         require("fs").writeFileSync(
//             "paymentInfoData.json",
//             JSON.stringify(req.body, null, 4)
//         );
//     } else {
//         //Do something
//     }
//     res.json({ status: "ok" });
// });

export { router as createChargeRouter };
