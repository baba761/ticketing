import { useState } from "react";
import useRequest from "../../hooks/use-request";
import { useRouter } from "next/router";

const NewTicket = () => {
    const router = useRouter();
    const [title, setTitle] = useState("");
    const [price, setPrice] = useState("");
    const { doRequest, errors } = useRequest({
        url: "/api/tickets",
        method: "post",
        body: {
            title,
            price,
        },
        onSuccess: (ticket) => router.push("/"),
    });

    //Price sanetizing
    const onBlur = () => {
        const value = parseFloat(price);
        if (isNaN(value)) {
            return;
        }
        setPrice(value.toFixed(2));
    };

    const onSubmit = async (event) => {
        event.preventDefault();
        await doRequest();
    };
    return (
        <div>
            <h1> Create New Ticket</h1>
            <form onSubmit={onSubmit}>
                <div className="mb-3 mt-3">
                    <label htmlFor="title">Title</label>
                    <input
                        value={title}
                        type="text"
                        className="form-control"
                        placeholder="Ticket Title"
                        onChange={(e) => setTitle(e.target.value)}
                    />
                </div>
                <div className="mb-3 mt-3">
                    <label htmlFor="price">Price</label>
                    <input
                        type="text"
                        className="form-control"
                        placeholder="price"
                        value={price}
                        onBlur={onBlur}
                        onChange={(e) => setPrice(e.target.value)}
                    />
                </div>
                {errors}
                <button type="submit" className="btn btn-primary">
                    Submit
                </button>
            </form>
        </div>
    );
};

export default NewTicket;
