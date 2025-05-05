import User from "../models/UserModel";
import db from "../database/database";
import QueryReturn from "../Utils/QueryReturn";

class LoginRepository{

    public async findUser(userReceived: User): Promise<User | null> {
    try {
        let queryConfig: QueryReturn = new QueryReturn(
          "SELECT * FROM tb_user WHERE email = ? and password = ? LIMIT 1;",
          [userReceived.getEmail(), userReceived.getPassword()]
        );
        const [row] = await db.query(
          queryConfig.generatedQuery,
          queryConfig.queryCompleter
        );
        const result = row as any[];
  
        if (result.length > 0) {
            let userFound: User = new User(
                result[0].email,
                result[0].password,
                result[0].name,
                result[0].id
              );
          return userFound;
        } else {
          return null;
        }
      } catch (error) {
        throw error;
      }
 }
}
export default LoginRepository;