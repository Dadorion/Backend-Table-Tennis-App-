import pool from "../database.js";
import Query from "../dataBuilders/queryBuilder.js";

class CompetitionService {
  async create(competition) {
    const { fp_user_id, sp_user_id, date, tournament_id, location_id, winner } =
      competition;

    const newCompetition = await pool.query(
      Query({
        type: "INSERT",
        table: "competition",
        columns: [
          "fp_user_id",
          "sp_user_id",
          "date",
          "tournament_id",
          "location_id",
          "winner",
        ],
      }).qString,
      [fp_user_id, sp_user_id, date, tournament_id, location_id, winner]
    );

    return newCompetition;
  }
  async getAll() {
    const q = Query.selectAll("competitions");
    const answer = await pool.query(q);
    return answer.rows;
  }
  async getOne(id) {
    if (!id) {
      throw new Error("не указан ID");
    }

    const answer = await pool.query(
      "SELECT * FROM competitions WHERE id = $1",
      [id]
    );
    return answer.rows[0];
  }
  async update(competition) {
    const {
      fp_user_id,
      sp_user_id,
      date,
      tournament_id,
      location_id,
      winner,
      id,
    } = competition;

    const updatedCompetition = await pool.query(
      "UPDATE competitions SET fp_user_id = $1, sp_user_id = $2, date = $3, tournament_id = $4, location_id = $5, winner = $6 WHERE id = $7 RETURNING *",
      [fp_user_id, sp_user_id, date, tournament_id, location_id, winner, id]
    );

    return updatedCompetition.rows;
  }
  async delete(id) {
    if (!id) {
      throw new Error("не указан ID");
    }

    const deletedCompetition = await pool.query(
      "DELETE FROM competitions WHERE id = $1 RETURNING *",
      [id]
    );
    return deletedCompetition.rows[0];
  }
}

export default new CompetitionService();
