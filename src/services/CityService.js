import pool from "../../database.js";

class CityService {
  async addCity(city) {
    const answer = await pool.query(
      "INSERT INTO cities (name) VALUES ($1) RETURNING id",
      [city]
    ).rows[0].id;
    return answer;
  }
  async getCityId(city) {
    const answer = (
      await pool.query("SELECT id FROM cities WHERE name = $1", [city])
    ).rows[0].id;
    return answer;
  }
}

export default new CityService();
