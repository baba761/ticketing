import mongoose from "mongoose";
import { app } from "./app";
const start = async () => {
    console.log("OKOKokOKOK");
    if (!process.env.JWT_KEY) {
        throw new Error("JWT_KEY must be defined");
    }
    if (!process.env.MONGO_URI) {
        throw new Error("MONGO_URI must be defined");
    }
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to mongodb");
    } catch (error) {
        console.log(error);
    }
};

app.listen(3001, () => {
    console.log(`Server is listing at 3001!`);
});
start();
