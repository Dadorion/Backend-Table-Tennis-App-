import pool from "../../database.js";
import Query from "../dataBuilders/queryBuilder.js";

class UserService {
  async create(user) {
    console.log(user);
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
  // async getOne(id) {
  //    if (!id) { throw new Error('не указан ID') }

  //    const q = Query.selectID('players')
  //    const answer = await pool.query(q, [id])
  //    return answer.rows[0]
  // }
  // async update(user) {
  //    const { name, surname, birthday, status, city, id } = user

  //    const q = Query.insert('players', ['name', 'surname', 'birthday', 'status', 'city'])
  //    const updetedPlayer = await pool.query(q, [name, surname, birthday, status, city, id])

  //    return updetedPlayer.rows
  // }
  // async delete(id) {
  //    if (!id) { throw new Error('не указан ID') }

  //    const q = Query.selectID('players')
  //    const deletedPlayer = await pool.query(q, [id])
  //    return deletedPlayer.rows[0]
  // }
}

export default new UserService();
