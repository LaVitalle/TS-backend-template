import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config";
import TokenData from "./TokenData";
import { error } from "console";

class jwtUtils {
  private secret = JWT_SECRET;

  public async generateToken(payload: {
    email: string;
    id: string | null | undefined;
  }): Promise<string | null | undefined> {
    if (!this.secret) {
      throw new Error("Error generating token");
    }
    return jwt.sign(payload, this.secret, {
      algorithm: "HS256",
      expiresIn: "2h",
    });
  }

  public async verifyToken(token: string): Promise<TokenData | null> {
    try {
      if (!this.secret) {
        throw new Error("Error verifying token");
      }
      const decoded = jwt.verify(token, this.secret) as jwt.JwtPayload;

      return new TokenData(
        decoded.id as string,
        decoded.email as string,
        decoded.iat,
        decoded.exp
      );
    } catch (error: any) {
      if (error.name === "TokenExpiredError") {
        throw new Error("Token has expired.");
      }
      if (error.name === "JsonWebTokenError") {
        throw new Error("Token is invalid.");
      }
      throw new Error("Failed to verify token.");
    }
  }
}

export default jwtUtils;
