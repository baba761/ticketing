import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";

declare global {
    var signup: () => Promise<string[]>;
}
jest.mock("tickets/src/__mocks__/nats-wrapper.ts");
let mongo: any;
beforeAll(async () => {
    process.env.JWT_KEY = "fdjslajfjdsaj";
    mongo = await MongoMemoryServer.create();
    const mongoUri = mongo.getUri();
    await mongoose.connect(mongoUri);
});

beforeEach(async () => {
    const collections = await mongoose.connection.db.collections();
    for (let collection of collections) {
        await collection.deleteMany({});
    }
});

afterAll(async () => {
    await mongo.stop();
    await mongoose.connection.close();
});

global.signup = async () => {
    // build a JWt payload.{id,email}
    const payload = {
        id: "4324298909",
        email: "test@test.com",
    };
    //create a jsonwebtoken
    const token = jwt.sign(payload, process.env.JWT_KEY!);

    //build session object {jwt: MY_JWT}
    const session = { jwt: token };

    //turn that session into Json
    const sessionJSON = JSON.stringify(session);

    //Take Json and encode it as base64
    const base64 = Buffer.from(sessionJSON).toString("base64");

    //return the string that the cookie with Jwt
    return [`session=${base64}`];
};

//one test case is pending that isAuthenticates user VideoNumber:213
