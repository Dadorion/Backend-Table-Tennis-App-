import pool from '../database.js'

class StatsService {
   calculateStats(scores) {
      const total = scores.length
      const wins = scores.filter(score => score.fp_score > score.sp_score)
      const winsCount = wins.length
      const winsPercent = total > 0 ? ((winsCount / total) * 100).toFixed(2) : 'пока нет побед'

      const totalScore = scores.reduce((sum, score) => {
         if (score.author === score.player_id) {
            return sum + score.fp_score
         } else {
            return sum + score.sp_score
         }
      }, 0)

      return {
         totalCount: total,
         winsCount,
         looseCount: total - winsCount,
         percent: +winsPercent,
         totalScore,
      }
   }

   async getOne(id) {
      const answerMatches = await pool.query(
         'SELECT matches.id, games.fp_score, games.sp_score FROM matches JOIN games ON matches.id = games.match_id WHERE matches.first_player = $1',
         [id]
      )

      const answerGames = await pool.query(
         `SELECT matches.id, games.fp_score, games.sp_score
         FROM matches
         JOIN players_matches ON matches.id = players_matches.match_id
         JOIN players ON players.id = players_matches.player_id
         JOIN games ON games.match_id = matches.id
         WHERE players.id = $1`,
         [id]
      )

      const matchesStats = this.calculateStats(answerMatches.rows)
      const gamesStats = this.calculateStats(answerGames.rows)

      return {
         matches: matchesStats,
         games: gamesStats,
      }
   }
}

export default new StatsService()
