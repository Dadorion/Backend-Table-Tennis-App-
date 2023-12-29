import pool from '../../database.js'

class StatsService {
   calculateStats(matches, matchesIds) {
      const total = matches.length
      const wins = matches.reduce((acc, game) => {
         if (game.a_id === game.p_id) {
            if (game.fp_score > game.sp_score) {
               acc.push('win')
            }
         } else {
            if (game.fp_score < game.sp_score) {
               acc.push('win')
            }
         }
         return acc
      }, [])


      const winsCount = wins.length
      const winsPercent =
         total > 0 ?
         ((winsCount / total) * 100).toFixed(2) :
         'пока нет побед'

      const totalScore = matches.reduce((acc, game) => {
         if (game.a_id === game.p_id) {
            acc.winScore += game.fp_score
            acc.loseScore += game.sp_score
         } else {
            acc.winScore += game.sp_score
            acc.loseScore += game.fp_score
         }
         if (game.a_id !== game.p_id) {
            acc.winScore += game.sp_score
            acc.loseScore += game.fp_score
         } else {
            acc.winScore += game.fp_score
            acc.loseScore += game.sp_score
         }
         return acc
      }, {
         winScore: 0,
         loseScore: 0
      })

      return {
         totalCount: total,
         winsCount,
         looseCount: total - winsCount,
         percent: +winsPercent,
         totalScore,
      }
   }

   async getOne(id) {
      const matchesIds = await pool.query(
         'SELECT DISTINCT matches.id FROM matches JOIN players_matches ON players_matches.match_id = matches.id JOIN players ON players.id = players_matches.player_id WHERE players.id = $1', [id]
      )
      const answerGames = await pool.query(
         'SELECT m.id AS m_id, m.author_id AS a_id, p.id AS p_id, p.name, g.id AS g_id, g.fp_score, g.sp_score FROM matches AS m JOIN games AS g ON m.id = g.match_id JOIN players_matches AS pm ON m.id = pm.match_id JOIN players AS p ON p.id = pm.player_id WHERE p.id = $1',
         [id]
      )
      const gamesStats = this.calculateStats(answerGames.rows, matchesIds.rows)

      return gamesStats
   }
}

export default new StatsService()
