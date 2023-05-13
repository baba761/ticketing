import React from "react";

const ShowPayment = ({ paymentId }) => {
    return <div>Reference No.{paymentId}</div>;
};

ShowPayment.getInitialProps = async (context, client) => {
    const { paymentId } = context.query;
    return { paymentId: paymentId };
};
export default ShowPayment;
