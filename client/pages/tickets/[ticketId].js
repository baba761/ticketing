import React from "react";
import useRequest from "../../hooks/use-request";
import { useRouter } from "next/router";

const TicketShow = ({ ticket }) => {
    const router = useRouter();
    const { doRequest, errors } = useRequest({
        url: "/api/orders",
        method: "post",
        body: {
            ticketId: ticket.id,
        },
        onSuccess: (order) => router.push(`/orders/${order.id}`),
    });
    return (
        <>
            <div className="col-sm-6">
                <div className="card">
                    <div className="card-body">
                        <h5 className="card-title">{ticket.title}</h5>
                        <p className="card-text">Price: {ticket.price}</p>
                        {errors}
                        <button onClick={doRequest} className="btn btn-primary">
                            Purchase
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

TicketShow.getInitialProps = async (context, client) => {
    const { ticketId } = context.query;
    const { data } = await client.get(`/api/tickets/${ticketId}`);
    return { ticket: data };
};

export default TicketShow;
