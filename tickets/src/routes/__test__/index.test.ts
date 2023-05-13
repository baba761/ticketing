import request from "supertest";
import { app } from "../../app";
import { response } from "express";

it("can fetch a list of tickets", async () => {
    const title = "okok";
    const price = 10;

    const ticket2 = await request(app)
        .post("/api/tickets")
        .set("Cookie", await global.signup())
        .send({
            title,
            price,
        })
        .expect(201);
    const ticket3 = await request(app)
        .post("/api/tickets")
        .set("Cookie", await global.signup())
        .send({
            title,
            price,
        })
        .expect(201);

    const allTickets = await request(app)
        .get("/api/tickets")
        .send()
        .expect(200);

    expect(allTickets.body.length).toEqual(3);
});
