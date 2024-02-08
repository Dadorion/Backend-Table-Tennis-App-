import pool from "../../database.js";
import Query from "../dataBuilders/queryBuilder.js";

class PlayerService {
  async create(player) {
    const { name, surname, birthday, status, city } = player;

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
  async createGhost({ name, surname }) {
    const newPlayer = await pool.query(
      ` INSERT 
        INTO players (name, surname) 
        VALUES ($1, $2) RETURNING*;`,
      [name, surname]
    );

    return newPlayer;
  }
  async getAll(page, pageSize, mode, direct) {
    const offset = page === 1 ? 0 : 3 * (page - 1);
    const players = await pool.query(
      `SELECT
        p.id,
        p.name,
        p.surname,
        p.photo_path
      FROM players AS p
      ORDER BY ${mode} ${direct}
      LIMIT ${pageSize}
      OFFSET ${offset}`
    );
    // names and id
    const ids = players.rows.map((p) => {
      return p.id;
    });

    const totalCount = await pool.query(`SELECT count(*) FROM players`);
    
    const answerMatches = await pool.query(
      `SELECT
        m.id AS match_id,
        m.author_id,
        p.id AS player_id,
        p.name,
        g.fp_score,
        g.sp_score
      FROM matches AS m
        JOIN games AS g ON m.id = g.match_id
        JOIN players_matches AS pm ON pm.match_id = m.id
        JOIN players AS p ON p.id = pm.player_id
      WHERE p.id = ANY($1)`,
      [ids]
    );

    const matches = answerMatches.rows.map((match) => {
      return {
        ...match,
        winer:
          match.fp_score > match.sp_score ? match.author_id : match.player_id,
      };
    });

    const players_matches = players.rows.map((p) => {
      const allPlayerMatches = matches.filter((m) => {
        return m.player_id === p.id;
      });

      let wins = 0;
      for (let i = 0; i < allPlayerMatches.length; i++) {
        const match = allPlayerMatches[i];
        if (match.player_id === match.winer) wins += 1;
      }
      let winsPersent = ((wins / allPlayerMatches.length) * 100).toFixed(2);
      winsPersent != "NaN" ? winsPersent : (winsPersent = "пока нет побед");

      return {
        ...p,
        winsPersent: winsPersent,
      };
    });

    let result = {
      pagination: {
        playersCount: players_matches.length,
        totalCount: totalCount.rows[0].count,
      },

      body: players_matches,
    };

    return result;
  }
  async getAllWithFilter(filter) {
    const players = await pool.query(
      `
      SELECT
        p.id,
        p.name,
        p.surname,
        p.photo_path
      FROM players AS p
      WHERE name ILIKE $1 OR surname ILIKE $1
      ORDER BY id ASC
    `,
      [findName]
    );
    return players.rows;
  }
  async getAllPredictive(findName) {
    const players = await pool.query(
      `
      SELECT
        p.id,
        p.name,
        p.surname,
        p.photo_path
      FROM players AS p
      WHERE name ILIKE $1 OR surname ILIKE $1
      ORDER BY id ASC
    `,
      [findName]
    );

    const ids = players.rows.map((p) => {
      return p.id;
    });

    const answerMatches = await pool.query(
      `SELECT
        m.id AS match_id,
        m.author_id,
        p.id AS player_id,
        p.name,
        g.fp_score,
        g.sp_score
      FROM matches AS m
        JOIN games AS g ON m.id = g.match_id
        JOIN players_matches AS pm ON pm.match_id = m.id
        JOIN players AS p ON p.id = pm.player_id
      WHERE p.id = ANY($1)`,
      [ids]
    );

    const matches = answerMatches.rows.map((match) => {
      return {
        ...match,
        winer:
          match.fp_score > match.sp_score ? match.author_id : match.player_id,
      };
    });

    const players_matches = players.rows.map((p) => {
      const allPlayerMatches = matches.filter((m) => {
        return m.player_id === p.id;
      });

      let wins = 0;
      for (let i = 0; i < allPlayerMatches.length; i++) {
        const match = allPlayerMatches[i];
        if (match.player_id === match.winer) wins += 1;
      }
      let winsPersent = ((wins / allPlayerMatches.length) * 100).toFixed(2);
      winsPersent != "NaN" ? winsPersent : (winsPersent = "пока нет побед");

      return {
        ...p,
        winsPersent: winsPersent,
      };
    });

    let result = {
      pagination: {
        playersCount: players_matches.length,
      },

      body: players_matches,
    };

    return result;
  }
  async getOne(id) {
    if (!id) {
      throw new Error("не указан ID");
    }

    const q = Query.selectID("players");
    const answer = await pool.query(q, [id]);
    return answer.rows[0];
  }
  async update(player) {
    const { name, surname, birthday, status, city, id } = player;

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
  async delete(id) {
    if (!id) {
      throw new Error("не указан ID");
    }

    const q = Query.selectID("players");
    const deletedPlayer = await pool.query(q, [id]);
    return deletedPlayer.rows[0];
  }
}

export default new PlayerService();
