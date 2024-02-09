import pool from "../../database.js";
import Query from "../dataBuilders/queryBuilder.js";

class UserService {
  async create(user) {
    const { name, surname, birthday, status, city } = user;

    const q = Query.insert("players", [
      "name",
      "surname",
      "birthday",
      "status",
      "city",
    ]);
    const newPlayer = await pool.query(q, [
      name,
      surname,
      birthday,
      status,
      city,
    ]);

    return newPlayer;
  }
  async getAll(page, limit) {
    const offset = (page - 1) * limit;
    const q = Query.selectAll("users", "*", "DESC");
    const answer = await pool.query(q, [limit, offset]);
    let result = {
      pagination: {
        usersCount: answer.rows.length,
      },

      body: [...answer.rows],
    };

    return result;
  }
  async updateMyPassword(userId, oldPassword, newPasswordOne, newPasswordTwo) {
    const q = Query.insert("players", [
      "name",
      "surname",
      "birthday",
      "status",
      "city",
    ]);
    const updatedPlayer = await pool.query(q, [
      name,
      surname,
      birthday,
      status,
      city,
      id,
    ]);

    return updatedPlayer.rows;
  }
}

export default new UserService();
