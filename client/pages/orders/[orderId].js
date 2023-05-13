import React, { useEffect, useState } from "react";
import axios from "axios";
import useRequest from "../../hooks/use-request";
import { useRouter } from "next/router";

const OrderShow = ({ order }) => {
    const router = useRouter();
    const [timeLeft, setTimeLeft] = useState(0);
    const { doRequest, errors } = useRequest({
        url: "/api/payments",
        method: "post",
        body: {
            orderId: order.id,
        },
        onSuccess: (data) => router.push("/orders"),
    });

    useEffect(() => {
        const findTimeLeft = () => {
            const msLeft = new Date(order.expiresAt) - new Date();
            setTimeLeft(Math.round(msLeft / 1000));
        };
        findTimeLeft();
        const timerId = setInterval(findTimeLeft, 1000);

        // this function is invoked when you away from the function
        return () => {
            clearInterval(timerId);
        };
    }, [order]);

    const buyHandler = () => {
        doRequest();
    };

    if (timeLeft < 0) {
        return <div> Order expired</div>;
    }

    return (
        <>
            <div>TimeLeft to Pay {timeLeft} seconds.</div>
            {errors}
            <button onClick={buyHandler}>Buy</button>
        </>
    );
};

OrderShow.getInitialProps = async (context, client) => {
    const { orderId } = context.query;

    const { data } = await client.get(`/api/orders/${orderId}`);

    return { order: data };
};

export default OrderShow;
