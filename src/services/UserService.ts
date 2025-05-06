import User from "../models/UserModel";
import { Request, Response } from "express";
import ValidationUtils from "../Utils/ValidationUtils";
import UserRepository from "../repository/UserRepository";
import jwtUtils from "../Utils/jwtUtils";

class UserService {
  private userRepository: UserRepository = new UserRepository();
  private validationUtils: ValidationUtils = new ValidationUtils();
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

  public async userInsert(req: Request, res: Response) {
    try {
      if (!req.body.email) {
        res.status(400).json({ Message: "Email is missing." });
      }
      if (!req.body.password) {
        res.status(400).json({ Message: "Password is missing." });
      }

      let userReceived: User = new User(
        req.body.email,
        await this.validationUtils.passwordHasher(req.body.password),
        req.body.name
      );

      if (userReceived) {
        if (this.validationUtils.isEmailValid(userReceived.getEmail())) {
          let userExists = await this.validationUtils.emailExist(
            userReceived.getEmail()
          );
          if (!userExists) {
            let success: number = await this.userRepository.save(userReceived);
            if (success !== 0) {
              res.status(201).json({ Message: "Created with success" });
            }
          } else {
            res.status(200).json({ Message: "User already exists." });
          }
        } else {
          res.status(400).json({ Message: "Invalid email." });
        }
      } else {
        res.status(400).json({ Message: "User missing." });
      }
    } catch (error) {
      res.status(500).json({ Message: error });
    }
  }
}

export default UserService;