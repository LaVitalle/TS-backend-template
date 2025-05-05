import { Router, Request, Response } from "express";
import UserService from "../../services/UserService";
import LoginService from "../../services/LoginService";

const usrRoute = Router();
const userService = new UserService();
const loginService = new LoginService();

usrRoute.post("/create", (req: Request, res: Response) => {
  try {
    userService.userInsert(req, res);
  } catch (error) {
    res.status(500).json({ message: ("Error" + error) });
  }
});

usrRoute.post("/login", (req: Request, res: Response) => {
    try {
      loginService.ValidateLogin(req, res);
      } catch (error) {
        res.status(500).json({ message: ("Error" + error) });
      } 
});

export default usrRoute;