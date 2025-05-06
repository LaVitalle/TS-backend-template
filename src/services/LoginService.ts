import { Request, Response } from "express";
import ValidationUtils from "../Utils/ValidationUtils";
import jwtUtils from "../Utils/jwt";
import User from "../models/UserModel";
import UserRepository from "../repository/UserRepository";

export class LoginService {
  private validationUtils: ValidationUtils = new ValidationUtils();
  private userRepository: UserRepository = new UserRepository();
  private jwt: jwtUtils = new jwtUtils();

  public async ValidateLogin(req: Request, res: Response) {
    try {
      if (!req.body.email) {
        res.status(400).json({ Message: "Email is missing." });
      }

      if (!req.body.password) {
        res.status(400).json({ Message: "Password is missing." });
      }

      let userReceived: User = new User(req.body.email, req.body.password, req.body.name);
      if (!this.validationUtils.isEmailValid(userReceived.getEmail())) {
        res.status(400).json({ Message: "Invalid email." });
      }

      let foundUser = await this.userRepository.findUser(userReceived, res);
      if (!foundUser) {
        res.status(401).json({ Message: "User not found." });
      }
      if (!foundUser?.getId() && foundUser?.getEmail()) {
        const token = await this.jwt.generateToken({
          id: foundUser.getId(),
          email: foundUser.getEmail(),
        });
        return res.status(200).json({
          message: "Login successful",
          token,
        });
      }
      res.status(400).json({ Message: "Invalid user data." });
    } catch (error) {
      res.status(500).json({ Message: error });
    }
  }
}
