import express from "express";
import "express-async-errors";
import { json } from "body-parser";
import cookieSession from "cookie-session";

import { errorHandler, NotFoundError, currentUser } from "@rgtix/common";
import { createTicketRouter } from "./routes/new";
import { showTicketRouter } from "./routes/show";
import { indexRouter } from "./routes";
import { updateRoutes } from "./routes/update";

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
app.use(createTicketRouter);
app.use(showTicketRouter);
app.use(indexRouter);
app.use(updateRoutes);

app.all("*", async () => {
    throw new NotFoundError();
});

app.use(errorHandler);

export { app };
