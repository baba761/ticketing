import React, { useState } from "react";
import useRequest from "../../hooks/use-request";
import { useRouter } from "next/router";

const signin = () => {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const { doRequest, errors } = useRequest({
        url: "/api/users/signin",
        method: "post",
        body: {
            email,
            password,
        },
        onSuccess: () => router.push("/"),
    });

    const onSubmit = async (event) => {
        event.preventDefault();
        await doRequest();
    };
    return (
        <form onSubmit={onSubmit}>
            <h1>Sign In</h1>
            <div className="mb-3 mt-3">
                <label htmlFor="email" className="form-label">
                    Email:
                </label>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="form-control"
                />
            </div>
            <div className="mb-3">
                <label htmlFor="password" className="form-label">
                    Password:
                </label>
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="form-control"
                />
            </div>
            {errors}
            <button type="submit" className="btn btn-primary">
                Sign In
            </button>
        </form>
    );
};

export default signin;
