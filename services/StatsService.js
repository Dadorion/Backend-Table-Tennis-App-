import pool from '../database.js'
// import Query from '../dataBuilders/queryBilder.js'

await pool.connect()

// {
//    page: 'stats',
//    matches:
//        {
//            percent: '63.2%',
//            totalCount: '128',
//            winsCount: '86',
//            looseCount: '42',
//            tcDelta: '+10/w',
//            wcDelta: '+3/w',
//            pDelta: '+0,3/w'
//        },
//    games:
//        {
//            percent: '80,1%',
//            totalCount: '512',
//            winsCount: '472',
//            looseCount: '40',
//            winsScore: '1384'
//        },
//    clubRaiting:
//        {
//             current: '128,1',
//             min: '100',
//             max: '141,1',
//             avg: '126'
//        }
//    totalPosition: '2',
//    TTWRaiting: 'not available now'
// }

class StatsService {
   async getAll() {
      // const q = Query.selectAll('competitions')
      // const answer = await pool.query(q)
      // return answer.rows
   }
   async getOne(id) {

      const answerMatches = await pool.query('SELECT matches.id, games.fp_score,games.sp_score FROM matches JOIN games ON matches.id = games.match_id WHERE matches.first_player = $1', [id])
      const answerGames = await pool.query(
         `SELECT
            matches.id,
            games.fp_score,
            games.sp_score
         FROM
            matches
            join players_matches on matches.id = players_matches.match_id
            join players on players.id = players_matches.player_id
            join games on games.match_id = matches.id
         WHERE
            players.id = $1`, [id])

      const matches = answerMatches.rows.map(match => {
         return match.fp_score > match.sp_score
      })
      let winsMatches = 0
      for (let i = 0; i < matches.length; i++) {
         if (matches[i]) winsMatches += 1
      }
      let winsMatchesPersent = (winsMatches / matches.length * 100).toFixed(2)
      // FIXME возможно лучшим решением будет округлять до целых значений
      winsMatchesPersent != 'NaN' ? winsMatchesPersent : winsMatchesPersent = 'пока нет побед'


      const games = answerGames.rows.map(game => {
         return game.fp_score > game.sp_score
      })
      let winsGames = 0
      for (let i = 0; i < games.length; i++) {
         if (games[i]) winsGames += 1
      }
      let winsGamesPersent = (winsGames / games.length * 100).toFixed(2)
      // FIXME возможно лучшим решением будет округлять до целых значений
      winsGamesPersent != 'NaN' ? winsGamesPersent : winsGamesPersent = 'пока нет побед'

      let countWinScore = 0
      for (let i = 0; i < answerGames.rows.length; i++) {
         if (answerGames.rows[i].author === answerGames.rows[i].player_id) {
            countWinScore += answerGames.rows[i].fp_score
         } else {
            countWinScore += answerGames.rows[i].sp_score
         }
      }
      let countLooseScore = 0
      for (let i = 0; i < answerGames.rows.length; i++) {
         if (answerGames.rows[i].author !== answerGames.rows[i].player_id) {
            countLooseScore += answerGames.rows[i].fp_score
         } else {
            countLooseScore += answerGames.rows[i].sp_score
         }
      }

      return {
         matches: {
            percent: winsMatchesPersent,
            totalCount: matches.length,
            winsCount: winsMatches,
            looseCount: matches.length - winsMatches
         },
         games: {
            percent: winsGamesPersent,
            totalCount: games.length,
            winsCount: winsGames,
            looseCount: games.length - winsGames,
            winsScore: countWinScore,
            looseScore: countLooseScore
         },
      }
   }
}

export default new StatsService()
