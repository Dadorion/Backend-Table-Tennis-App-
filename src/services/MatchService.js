import pool from "../../database.js";
import Query from "../dataBuilders/queryBuilder.js";
import responseBuilder from "../responseBuilders/match_respBuilder.js";
import playerMatchesRespBuilder from "../responseBuilders/playerMatch_respBuilder .js";
import builderQuerySQL from "../dataBuilders/builderSQL.js";

class MatchService {
  async create(match) {
    const { is_important, date, location_id, fPlayer, sPlayer, games } = match;

    const qMatch = Query.insert("matches", [
      "is_important",
      "date",
      "location_id",
      "player_id",
    ]);
    const newMatch = await pool.query(qMatch, [
      is_important,
      date,
      location_id,
      fPlayer,
    ]);

    const newMatchId = newMatch.rows[0].id;

    const qPlayersMatches = Query.insert("players_matches", [
      "player_id",
      "match_id",
    ]);
    const qGame = Query.insert("games", ["fp_score", "sp_score", "match_id"]);

    await pool.query(qPlayersMatches, [fPlayer, newMatchId]);
    await pool.query(qPlayersMatches, [sPlayer, newMatchId]);

    games.forEach(async (game) => {
      await pool.query(qGame, [game.fpScore, game.spScore, newMatchId]);
    });

    return "new match saved";
  }
  async getAll(date, is_important, playerIds, page, matchesPerPage) {
    if (!date) date = "2000-01-01, 2100-12-31";
    if (!is_important) is_important = false;
    if (!playerIds) playerIds = null;
    if (!page) page = 1;
    if (!matchesPerPage) matchesPerPage = 5;

    class Filter {
      constructor(page, matchesPerPage) {
        this.page = `page = ${page}`;
        this.matchesPerPage = `matchesPerPage = ${matchesPerPage}`;
      }
    }

    class FilterBuilder {
      constructor(page, matchesPerPage) {
        this.filter = new Filter(page, matchesPerPage);
      }

      setDate(date) {
        let dates = date.split(","),
          d1 = "",
          d2 = "";
        if (dates[1]) {
          d1 = dates[0];
          d2 = dates[1];
        } else {
          d1 = dates[0];
          d2 = dates[0];
        }

        this.filter.strDate = `date BETWEEN DATE '${d1}' AND DATE '${d2}'`;
        return this;
      }
      setImportant(is_important) {
        this.filter.strImportant = `matches.is_important = ${is_important}`;
        return this;
      }
      setPlayerIds(playerIds) {
        this.filter.strPlayers = `players.id in (${playerIds})`;
        return this;
      }

      build() {
        this.str = "";
        if (
          this.filter.strDate !== undefined ||
          this.filter.strImportant !== undefined ||
          this.filter.strPlayers !== undefined
        )
          this.str += `WHERE `;
        let paramsCount = 0;
        if (this.filter.strDate !== undefined) {
          paramsCount > 0 ? (this.str += `AND `) : null;
          this.str += `${this.filter.strDate} `;
          paramsCount++;
        }
        if (this.filter.strImportant !== undefined) {
          paramsCount > 0 ? (this.str += `AND `) : null;
          this.str += `${this.filter.strImportant} `;
          paramsCount++;
        }
        if (this.filter.strPlayers !== undefined) {
          paramsCount > 0 ? (this.str += `AND `) : null;
          this.str += `${this.filter.strPlayers} `;
          paramsCount++;
        }

        if (this.filter.strStudCount !== undefined)
          this.str += `${this.filter.strStudCount}`;
        return this.str;
      }
    }

    let filter = new FilterBuilder(page, matchesPerPage);
    if (date) filter.setDate(date);
    if (is_important) filter.setStatus(is_important);
    if (playerIds) filter.setTeacherIds(playerIds);

    const q = `
      SELECT
         matches.id,
         matches.date,
         is_important,
         locations.name as location,
         matches.first_player as author,
         players.id as player_id,
         players.name,
         games.fp_score,
         games.sp_score
      FROM
         matches
      JOIN players_matches ON matches.id = players_matches.match_id
      JOIN players ON players.id = players_matches.player_id
      JOIN locations ON locations.id = matches.location_id
      JOIN games ON games.match_id = matches.id
      WHERE
         matches.id IN (
            SELECT
               matches.id
            FROM
               matches
            ORDER BY id DESC
            LIMIT 3
         )
      ORDER BY
         matches.id DESC
      `;
    const answer = await pool.query(q);

    const answerMatches = responseBuilder(answer.rows);
    const totalMatches = await (
      await pool.query("SELECT count(*) FROM matches")
    ).rows[0].count;
    let result = {
      pagination: {
        matchesCount: answerMatches.length,
        totalMatches: totalMatches,
        totalPages: Math.round(totalMatches / matchesPerPage),
        currentPage: page,
        perPage: matchesPerPage,
        maxPerPage: 100,
      },

      body: [...answerMatches],
    };

    return result;
  }
  async playerMatches(id) {
    if (!id) {
      throw new Error(
        "Получение матчей игрока не удалось. Не указан ID игрока."
      );
    }
    const q = `
      SELECT
         m.id AS m_id,
         g.id AS g_id,
         date,
         s.name AS city,
         l.name AS loc,
         m.author_id,
         a.name AS author_name,
         a.surname AS author_surname,
         p.name AS player_name,
         p.surname AS player_surname,
         g.fp_score,
         g.sp_score
      FROM matches AS m
         JOIN locations AS l ON l.id = m.location_id
         JOIN cities AS s ON s.id = l.city_id
         JOIN players_matches AS pm ON pm.match_id = m.id
         JOIN players AS a ON a.id = m.author_id
         JOIN players AS p ON p.id = pm.player_id
         JOIN games AS g ON g.match_id = m.id
      WHERE
         m.author_id != pm.player_id
         AND m.id IN (
            SELECT
                  DISTINCT m2.id
            FROM
                  matches AS m2
                  JOIN players_matches AS pm2 ON pm2.match_id = m2.id
                  JOIN players AS p2 ON p2.id = pm2.player_id
            WHERE p2.id = 11
         );`;

    const answer = await pool.query(q);

    const answerMatches = playerMatchesRespBuilder(answer.rows);

    const totalMatches = await (
      await pool.query("SELECT count(*) FROM matches")
    ).rows[0].count;
    let result = {
      pagination: {
        matchesCount: answerMatches.length,
        totalMatches: totalMatches,
      },

      body: [...answerMatches],
    };

    return result;
  }
}

export default new MatchService();
