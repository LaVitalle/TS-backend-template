import { SignJWT, jwtVerify } from "jose";
import { JWT_SECRET } from "../config";
import TokenData from "./TokenData";

class jwtUtils {
  secret = new TextEncoder().encode(JWT_SECRET);

  public async generateToken(payload: {
    email: string;
    id: string | null | undefined;
  }) {
    const jose = await import('jose');
    
    return await new SignJWT(payload)
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("2h")
      .sign(this.secret);
  }

  public async verifyToken(token: string): Promise<TokenData | null> {
    try {
      const { payload } = await jwtVerify(token, this.secret);

      return new TokenData(
        payload.id as string,
        payload.email as string,
        payload.iat,
        payload.exp
      );
    } catch (error) {
      if (error instanceof Error && error.message.includes("jwt expired")) {
        throw new Error("Token has expired.");
      }
      if (error instanceof Error && error.message.includes("jwt malformed")) {
        throw new Error("Token is invalid.");
      }
      throw new Error("Failed to verify token.");
    }
  }
}
export default jwtUtils;
