import React, { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
    CardNumberElement,
    CardCvcElement,
    CardExpiryElement,
    Elements,
    useStripe,
    useElements,
} from "@stripe/react-stripe-js";
import useRequest from "../hooks/use-request";
import { useRouter } from "next/router";

const stripePromise = loadStripe(
    "pk_test_51Klp9hSFqE6O1vLRoTW0pYTRiBveFDVLKL1tdldYC7zEhJt5XmvejfLBQmWGqdlhccgMtyJqf9Y9T0H0mpCuKyix002UTezbiQ"
);

const CheckoutForm = ({ order, currentUser }) => {
    const router = useRouter();
    const [client_secret, setclient_secret] = useState("");
    const stripe = useStripe();
    const elements = useElements();
    const { doRequest, errors } = useRequest({
        url: "/api/payments",
        method: "post",
        body: {
            amount: order.ticket.price * 100,
            orderId: order.id,
        },
        onSuccess: async (data) => {
            // const result = await stripe.confirmCardPayment(data.client_secret, {
            //     payment_method: {
            //         card: elements.getElement(CardNumberElement),
            //         billing_details: {
            //             name: currentUser.email,
            //             email: currentUser.email,
            //             /*  address: {
            //                 line1: shippingInfo.address,
            //                 city: shippingInfo.city,
            //                 state: shippingInfo.state,
            //                 postal_code: shippingInfo.pinCode,
            //                 country: shippingInfo.country,
            //             }, */
            //         },
            //     },
            // });
            // console.log(result);

            // if (result.error) {
            //     console.log(result.error);
            // } else {
            //     console.log(result);
            // }
            if (!data.client_secret) {
                alert("Payment failed");
            } else {
                alert(" Paid successfully");
                router.push("/");
            }
        },
    });
    const submitHandler = async (e) => {
        e.preventDefault();
        try {
            await doRequest();
        } catch (error) {
            console.log(error);
        }
    };
    return (
        <Elements stripe={stripePromise}>
            <div className="paymentContainer">
                <form
                    className="paymentForm"
                    onSubmit={(e) => submitHandler(e)}
                >
                    <h4>Card Info</h4>
                    <div>
                        <label>Card Number</label>
                        <CardNumberElement />
                    </div>
                    <div>
                        <label> Expiry Date</label>
                        <CardExpiryElement />
                    </div>
                    <div>
                        <label>CVV</label>
                        <CardCvcElement />
                    </div>

                    <input
                        type="submit"
                        value={`Pay - ₹${order && order.ticket.price}`}
                    />
                </form>
            </div>
        </Elements>
    );
};

export default CheckoutForm;
