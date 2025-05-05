import { Request, Response } from "express";
import ValidationUtils from "../Utils/ValidationUtils";
import LoginRepository from "../repository/LoginRepository";
import User from "../models/UserModel";

class LoginService {
  private validationUtils: ValidationUtils = new ValidationUtils();
  private loginRepository: LoginRepository = new LoginRepository();

  public async ValidateLogin(req: Request, res: Response) {
    try {
      if (!req.body.email) {
        res.status(400).json({ Message: "Email is missing." });
      }

      if (!req.body.password) {
        res.status(400).json({ Message: "Password is missing." });
      }

      let userReceived: User = new User(req.body.email, req.body.password);
      if (!this.validationUtils.isEmailValid(userReceived.getEmail())) {
        res.status(400).json({ Message: "Invalid email." });
      }

      let foundUser =  await this.loginRepository.findUser(userReceived);
      if(!foundUser){
        res.status(401).json({ Message: "User not found." });
      }
      return res.status(200).json({
        message: "Login successful.",
        user: foundUser
      });
    } catch (error) {
      res.status(500).json({ Message: error });
    }
  }
}
export default LoginService;