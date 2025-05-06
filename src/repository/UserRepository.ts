import User from "../models/UserModel";
import db from "../database/database";
import QueryReturn from "../Utils/QueryReturn";
import QueryUtils from "../Utils/QueryUtils";
import ValidationUtils from "../Utils/ValidationUtils";
import { Request, Response } from "express";

class UserRepository {
  private queryController: QueryUtils = new QueryUtils();
  private validationUtils: ValidationUtils = new ValidationUtils();

  public async findUser(userReceived: User, res: Response): Promise<User | null> {
    try {
      let queryConfig: QueryReturn = new QueryReturn(
        "SELECT * FROM tb_user WHERE userEmail = ? LIMIT 1;",
        [userReceived.getEmail()]
      );
      const [row] = await db.query(
        queryConfig.generatedQuery,
        queryConfig.queryCompleter
      );
      const result = row as any[];

      if (result.length > 0) {
        if (
          !this.validationUtils.passwordCompare(
            userReceived.getPassword(),
            result[0].userPassword
          )
        ) {
          res.status(401).json({ Message: "Invalid email or password" });
        }
        let userFound: User = new User(
          result[0].userEmail,
          result[0].userPassword,
          result[0].userName,
          result[0].idUser
        );
        return userFound;
      } else {
        return null;
      }
    } catch (error) {
      throw error;
    }
  }

  public async save(user: User): Promise<number> {
    try {
      let userQuery: QueryReturn =
        this.queryController.UserInsertGenerate(user);
      let result: any = await db.query(
        userQuery.generatedQuery,
        userQuery.queryCompleter
      );

      if (result[0].insertId) {
        return result[0].insertId;
      } else {
        return 0;
      }
    } catch (error) {
      throw error;
    }
  }

  public async findByEmail(email: string): Promise<string | null> {
    try {
      let queryConfig: QueryReturn = new QueryReturn(
        "SELECT userEmail FROM tb_user WHERE userEmail = ? LIMIT 1;",
        [email]
      );
      const [row] = await db.query(
        queryConfig.generatedQuery,
        queryConfig.queryCompleter
      );
      const result = row as any[];

      if (result.length > 0) {
        return result[0].userEmail;
      } else {
        return null;
      }
    } catch (error) {
      throw error;
    }
  }
}

export default UserRepository;