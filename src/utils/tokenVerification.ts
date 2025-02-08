import jwt from "jsonwebtoken";
import { JwtPayload } from "../interfaces/common.interface";

const isTokenValid = (token: string) => {
    try {
        const decoded = jwt.decode(token);

        if (decoded && typeof decoded === "object" && "exp" in decoded) {
            return (decoded as JwtPayload).exp > Date.now() / 1000;
        } else {
            return false;
        }
    } catch (error) {
        return { valid: false, expired: true, decoded: null };
    }
};

export default isTokenValid;