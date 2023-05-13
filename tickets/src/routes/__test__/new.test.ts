import request from "supertest";
import { app } from "../../app";
import { Ticket } from "../../models/ticket";

it("has a route handler listing to /api/tickets for post request", async () => {
    const response = await request(app).post("/api/tickets").send({});
    expect(response.status).not.toEqual(404);
});

it("can be only accessed if the user is signed in", async () => {
    await request(app).post("/api/tickets").send({}).expect(401);
});

it("return the status other then 401", async () => {
    const response = await request(app)
        .post("/api/tickets")
        .set("Cookie", await global.signup())
        .send({});
    expect(response.status).not.toEqual(401);
});

it("retunrs an error if an invalid title is provided", async () => {
    await request(app)
        .post("/api/tickets")
        .set("Cookie", await global.signup())
        .send({
            title: "",
            price: 10,
        })
        .expect(400);
    await request(app)
        .post("/api/tickets")
        .set("Cookie", await global.signup())
        .send({
            price: 10,
        })
        .expect(400);
});

it("retunrs an error if an invalid price is provided", async () => {
    await request(app)
        .post("/api/tickets")
        .set("Cookie", await global.signup())
        .send({
            title: "OKOK",
        })
        .expect(400);
    await request(app)
        .post("/api/tickets")
        .set("Cookie", await global.signup())
        .send({
            title: "OKOK",
            price: -10,
        })
        .expect(400);
});

it("create a ticket with valid parameters", async () => {
    // add in check to make sure that ticket was created.
    let tickets = await Ticket.find({});

    expect(tickets.length).toEqual(0);

    await request(app)
        .post("/api/tickets")
        .set("Cookie", await global.signup())
        .send({
            title: "OKOK",
            price: 10,
        })
        .expect(201);

    tickets = await Ticket.find({});
    expect(tickets.length).toEqual(1);
});
