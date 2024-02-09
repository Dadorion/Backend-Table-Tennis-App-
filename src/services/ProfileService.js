import pool from "../../database.js";
import {
  checkMatches,
  winsPercent,
} from "../dataBuilders/calculateWinsPercent.js";

class ProfileService {
  async getOne(id) {
    if (!id) {
      throw new Error("не указан ID в ссылке после /");
    }

    const profileIsExist = await pool.query(
      "SELECT id FROM players WHERE id = $1",
      [id]
    );

    if (profileIsExist.rows.length == 0) return;

    const answerInfo = await pool.query(
      "SELECT players.id as id, players.name, surname, status, cities.name as city,EXTRACT(YEAR FROM birthday) AS b_Year,base,forehand_pad,backhand_pad FROM players JOIN cities ON cities.id = players.city_id WHERE players.id = $1 ",
      [id]
    );

    const answerMatches = await pool.query(
      "SELECT matches.id, games.fp_score,games.sp_score FROM matches JOIN games ON matches.id = games.match_id WHERE matches.player_id = $1",
      [id]
    );

    const matches = answerMatches.rows.map((match) => {
      return match.fp_score > match.sp_score;
    });

    let wins = 0;
    for (let i = 0; i < matches.length; i++) {
      if (matches[i]) wins += 1;
    }
    let winsPercent = ((wins / matches.length) * 100).toFixed(2);
    winsPercent != "NaN" ? winsPercent : (winsPercent = "пока нет побед");

    let grade = "не оценен";
    if (winsPercent > 80) {
      grade = "тотальный";
    } else if (winsPercent > 60) {
      grade = "высокий";
    } else if (winsPercent > 40) {
      grade = "нормальный";
    } else if (winsPercent <= 40) {
      grade = "низкий";
    }

    return {
      id: answerInfo.rows[0].id,
      name: answerInfo.rows[0].name,
      surname: answerInfo.rows[0].surname,
      status: answerInfo.rows[0].status,
      city: answerInfo.rows[0].city,
      b_year: answerInfo.rows[0].b_year,
      winsPercent,
      grade,
      racket: {
        base: answerInfo.rows[0].base,
        forehand_pad: answerInfo.rows[0].forehand_pad,
        backhand_pad: answerInfo.rows[0].backhand_pad,
      },
    };
  }
  async getMyProfile(id) {
    if (!id) {
      throw new Error("не указан ID");
    }

    const answerInfo = await pool.query(
      `SELECT
         p.id as id,
         p.name,
         surname,
         status,
         c.name as city,
         region,
         birthday,
         base,
         forehand_pad,
         backhand_pad,
         photo_path
      FROM players AS p
         JOIN cities AS c ON c.id = p.city_id
      WHERE p.id = $1 `,
      [id]
    );
    const answerMatches = await pool.query(
      `
        SELECT
          m.id,
          m.author_id,
          p.id AS player_id,
          (SELECT pm4.player_id
            FROM
              players_matches AS pm4
            WHERE
              pm4.match_id = m.id
              AND (
                  CASE
                      WHEN m.author_id = p.id THEN pm4.player_id != m.author_id
                      ELSE pm4.player_id = m.author_id
                  END
              )
          ) AS opponent_id,
          (SELECT name
            FROM players AS p2
            WHERE
              p2.id = m.author_id
          ) AS author,
          p.name AS player,
          (SELECT name
            FROM
              players AS p_opponent
            WHERE p_opponent.id = (
                  SELECT
                      pm4.player_id
                  FROM
                      players_matches AS pm4
                  WHERE
                      pm4.match_id = m.id
                      AND (
                          CASE
                              WHEN m.author_id = p.id THEN pm4.player_id != m.author_id
                              ELSE pm4.player_id = m.author_id
                          END
                      )
          )
      ) AS opponent,
      g.fp_score,
      g.sp_score
        FROM matches AS m
          JOIN games AS g ON m.id = g.match_id
          JOIN players_matches AS pm ON pm.match_id = m.id
          JOIN players AS p ON p.id = pm.player_id
        WHERE m.id IN (
          SELECT DISTINCT m3.id
          FROM matches AS m3
            JOIN players_matches AS pm3 ON pm3.match_id = m3.id
            JOIN players AS p3 ON p3.id = pm3.player_id
          WHERE p3.id = $1)
          AND p.id = $1`,
      [id]
    );

    const checkedMatches = checkMatches(answerMatches.rows);
    const percentOfWin = winsPercent(checkedMatches);

    return { ...answerInfo.rows[0], percentOfWin };
  }
  async updateMyProfile(id, newProfileData) {
    if (!id) {
      throw new Error("не указан ID");
    }

    const { name, surname, base, forehand_pad, backhand_pad } = newProfileData;

    const answerInfo = await pool.query(
      `UPDATE players SET (name, surname, base, forehand_pad, backhand_pad) = ($2, $3, $4, $5, $6)
    WHERE id = $1 RETURNING *`,
      [id, name, surname, base, forehand_pad, backhand_pad]
    );

    return { code: 0, ...answerInfo.rows[0] };
  }
  async updateMyStatus(id, statusText) {
    if (!id) {
      throw new Error("не указан ID");
    }

    const answerInfo = await pool.query(
      `UPDATE players SET status = $2
    WHERE id = $1 RETURNING *`,
      [id, statusText]
    );

    return { code: 0, ...answerInfo.rows[0] };
  }
  async updateMyPhoto(id, filePath) {
    if (!id) {
      throw new Error("не указан ID");
    }
    const answerInfo = await pool.query(
      `UPDATE players SET photo_path = $2
    WHERE id = $1 RETURNING *`,
      [id, filePath]
    );

    return { code: 0, ...answerInfo.rows[0] };
  }
}

export default new ProfileService();
