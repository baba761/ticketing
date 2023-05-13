import { scrypt, randomBytes } from "crypto";
import { promisify } from "util";

/* 
This function converts a callback-based function (like scrypt)
into a Promise-based function, which can be easier to work with in 
modern JavaScript applications.
 */
const scriptAsync = promisify(scrypt);

export class PasswordManager {
    /**
     * This method is used to hash the given password.
     * @param password this is the password that are going to be hashed.
     */
    static async toHash(password: string) {
        const salt = randomBytes(8).toString("hex");
        const buffer = (await scriptAsync(password, salt, 64)) as Buffer;

        return `${buffer.toString("hex")}.${salt}`;
    }

    static async compare(storedPassword: string, suppliedPassword: string) {
        const [hashedPassword, salt] = storedPassword.split(".");
        const buffer = (await scriptAsync(
            suppliedPassword,
            salt,
            64
        )) as Buffer;

        return buffer.toString("hex") === hashedPassword;
    }
}
