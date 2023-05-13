import express, { NextFunction, Request, Response } from "express";
import { body } from "express-validator";
import jwt from "jsonwebtoken";
import { User } from "../models/user";
import { BadrequestError, validateRequest } from "@rgtix/common";
import { PasswordManager } from "../services/password-Manager";

const router = express.Router();

router.post(
    "/api/users/signin",
    [
        body("email").isEmail().withMessage("Email must be valid"),
        body("password")
            .trim()
            .notEmpty()
            .withMessage("Password must be supplied"),
    ],
    validateRequest,
    async (req: Request, res: Response, next: NextFunction) => {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            throw new BadrequestError("Invalid Credentials!");
        }
        const isPasswordMatch = await PasswordManager.compare(
            user.password,
            password
        );

        if (!isPasswordMatch) {
            throw new BadrequestError("Invalid Credentials!");
        }
        //Generate web token
        const userJwt = jwt.sign(
            {
                id: user.id,
                email: user.email,
            },
            process.env.JWT_KEY!
        );
        req.session = {
            jwt: userJwt,
        };
        res.status(200).send(user);
    }
);

export { router as signInRouter };
