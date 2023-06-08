import express from "express";
import "express-async-errors";
import { json } from "body-parser";
import cookieSession from "cookie-session";

import { errorHandler, NotFoundError, currentUser } from "@rgtix/common";
import { indexOrderRouter } from "./routes";
import { showOrderRouter } from "./routes/show";
import { deleteOrderRoutes } from "./routes/delete";
import { createOrderRouter } from "./routes/new";

const app = express();
// Enable Trust Proxy.
app.set("trust proxy", true);
app.use(json());

app.use(
    cookieSession({
        signed: false,
        secure: false,
    })
);

app.use(currentUser);

//inject the routes
app.use(indexOrderRouter);
app.use(showOrderRouter);
app.use(deleteOrderRoutes);
app.use(createOrderRouter);

app.all("*", async () => {
    throw new NotFoundError();
});

app.use(errorHandler);

export { app };
