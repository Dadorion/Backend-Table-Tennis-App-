import pool from '../database.js'
import Query from '../dataBuilders/queryBuilder.js'
import responceBuilder from '../responceBuilders/match_respBuilder.js'
import builderQuerySQL from '../dataBuilders/builderSQL.js'

class MatchService {
   async create(match) {
      const { is_important, date, location_id, parts, fPlayer, sPlayer, games } = match

      const qMatch = Query.insert('matches', ['is_important', 'date', 'location_id', 'first_player'])
      const newMatch = await pool.query(qMatch, [is_important, date, location_id, fPlayer])
      // console.log(newMatch.rows[0])

      const qPlayersMatches = Query.insert('players_matches', ['player_id', 'match_id'])
      const qGame = Query.insert('games', ['fp_score', 'sp_score', 'match_id'])

      await pool.query(qPlayersMatches, [fPlayer, newMatch.rows[0].id])
      await pool.query(qPlayersMatches, [sPlayer, newMatch.rows[0].id])

      games.forEach(async game => {
         await pool.query(qGame, [game.fpScore, game.spScore, newMatch.rows[0].id])
      });


      // const q = Query.transactions(games, match_id, players, is_important, date, location)
      // const newMatch = await pool.query(q, [fpScore, spScore])

      // const transactionSQL = `
      // BEGIN;

      // INSERT INTO matches (is_important, date, location, first_player) VALUES (${is_important}, ${date}, ${location}, ${fPlayer});
      // //                                                                              $1           $2          $3          $4

      // COMMIT;`
      // сколько конкретно геймов будет неизвестно 1, 3, 5, 7

      return 'new match saved'
   }
   async getAll(date, is_important, playerIds, page, matchesPerPage) {
      if (!date) date = "2000-01-01, 2100-12-31"
      if (!is_important) is_important = false
      if (!playerIds) playerIds = null
      if (!page) page = 1
      if (!matchesPerPage) matchesPerPage = 5

      class Filter {
         constructor(page, matchesPerPage) {
            this.page = `page = ${page}`
            this.matchesPerPage = `matchesPerPage = ${matchesPerPage}`
         }
      }

      class FilterBuilder {
         constructor(page, matchesPerPage) {
            this.filter = new Filter(page, matchesPerPage)
         }

         setDate(date) {
            let dates = date.split(","), d1 = '', d2 = ''
            if (dates[1]) {
               d1 = dates[0]
               d2 = dates[1]
            } else {
               d1 = dates[0]
               d2 = dates[0]
            }

            this.filter.strDate = `date BETWEEN DATE '${d1}' AND DATE '${d2}'`
            return this
         }
         setImportant(is_important) {
            this.filter.strImportant = `matches.is_important = ${is_important}`
            return this
         }
         setPlayerIds(playerIds) {
            this.filter.strPlayers = `players.id in (${playerIds})`
            return this
         }

         build() {
            this.str = ''
            if (this.filter.strDate !== undefined || this.filter.strImportant !== undefined || this.filter.strPlayers !== undefined) this.str += `WHERE `
            let paramsCount = 0
            if (this.filter.strDate !== undefined) { paramsCount > 0 ? this.str += `AND ` : null; this.str += `${this.filter.strDate} `; paramsCount++ }
            if (this.filter.strImportant !== undefined) { paramsCount > 0 ? this.str += `AND ` : null; this.str += `${this.filter.strImportant} `; paramsCount++ }
            if (this.filter.strPlayers !== undefined) { paramsCount > 0 ? this.str += `AND ` : null; this.str += `${this.filter.strPlayers} `; paramsCount++ }

            if (this.filter.strStudCount !== undefined) this.str += `${this.filter.strStudCount}`
            return this.str
         }
      }

      let filter = new FilterBuilder(page, matchesPerPage)
      if (date) filter.setDate(date)
      if (is_important) filter.setStatus(is_important)
      if (playerIds) filter.setTeacherIds(playerIds)
      // filter.build()

      // const q = builderQuerySQL.createQuery(filter.build(), matchesPerPage)
      // console.log(q)
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
      `
      const answer = await pool.query(q)

      const answerMatches = responceBuilder(answer.rows)
      const totalMatches = await (await pool.query('SELECT count(*) FROM matches')).rows[0].count
      let result =
      {
         "pagination":
         {
            "matchesCount": answerMatches.length,
            "totalMatches": totalMatches,
            "totalPages": Math.round(totalMatches / matchesPerPage),
            "currentPage": page,
            "perPage": matchesPerPage,
            "maxPerPage": 100,
         },

         "body": [...answerMatches]
      }

      return result
   }

   // async getOne(id) {
   //    if (!id) { throw new Error('не указан ID') }

   //    const q = Query.selectID('players')
   //    const answer = await pool.query(q, [id])
   //    return answer.rows[0]
   // }
   // async update(user) {
   //    const { name, surname, birthday, is_important, city, id } = user

   //    const q = Query.insert('players', ['name', 'surname', 'birthday', 'is_important', 'city'])
   //    const updetedPlayer = await pool.query(q, [name, surname, birthday, is_important, city, id])

   //    return updetedPlayer.rows
   // }
   // async delete(id) {
   //    if (!id) { throw new Error('не указан ID') }

   //    const q = Query.selectID('players')
   //    const deletedPlayer = await pool.query(q, [id])
   //    return deletedPlayer.rows[0]
   // }
}

export default new MatchService()
