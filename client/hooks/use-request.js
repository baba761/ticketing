// Importing Axios and useState hooks from React
import axios from "axios";
import { useState } from "react";

// Exporting a custom hook that takes URL, method, and body as input
export default ({ url, method, body, onSuccess }) => {
    // Setting up a state variable for errors using useState hook
    const [errors, setErrors] = useState(null);

    // Defining an async function doRequest that makes an HTTP request using Axios
    const doRequest = async () => {
        try {
            // Resetting errors to null before making the request
            setErrors(null);

            // Sending the HTTP request using Axios and storing the response
            const response = await axios[method](url, body);

            //On success call back funcion
            if (onSuccess) {
                onSuccess(response.data);
            }
            // Returning the response data if the request was successful
            return response.data;
        } catch (err) {
            // Setting errors in the state variable if the request fails
            setErrors(
                <div className="alert alert-danger">
                    <h4>Oooops ....</h4>
                    <ul className="my-0">
                        {err.response.data.errors.map((err) => (
                            <li key={err.message}>{err.message}</li>
                        ))}
                    </ul>
                </div>
            );
        }
    };

    // Returning an object with the doRequest function and errors state variable
    return { doRequest, errors };
};
