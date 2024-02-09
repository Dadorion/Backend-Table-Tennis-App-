import client from "../database.js";
import Query from "../dataBuilders/queryBuilder.js";

class NotificationService {
  async create(notification) {
    const { name, surname, birthday, status, city } = notification;

    const q = Query.insert("players", [
      "name",
      "surname",
      "birthday",
      "status",
      "city",
    ]);
    const newNotification = await client.query(q, [
      name,
      surname,
      birthday,
      status,
      city,
    ]);

    return newNotification;
  }

  async getAll() {
    const answer = await client.query(
      "SELECT players.id, name, surname, birthday, status, city, max, min, current FROM players JOIN rating_club ON players.id = rating_club.player_id ORDER BY current DESC"
    );
    return answer.rows;
  }

  async getAllForOnePlayer(id) {
    if (!id) {
      throw new Error("не указан ID");
    }

    const answer = await client.query(
      "SELECT * FROM notifications WHERE player_id = $1 ORDER BY id DESC LIMIT 5",
      [id]
    );
    return answer.rows;
  }
  async update(notification) {
    const { name, surname, birthday, status, city, id } = notification;

    const q = Query.insert("players", [
      "name",
      "surname",
      "birthday",
      "status",
      "city",
    ]);
    const updatedNotification = await client.query(q, [
      name,
      surname,
      birthday,
      status,
      city,
      id,
    ]);

    return updatedNotification.rows;
  }
  async delete(id) {
    if (!id) {
      throw new Error("не указан ID");
    }

    const q = Query.selectID("players");
    const deletedNotification = await client.query(q, [id]);
    return deletedNotification.rows[0];
  }
}

export default new NotificationService();
