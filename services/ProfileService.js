import pool from '../database.js'

class ProfileService {
   async getOne(id) {

      if (!id) { throw new Error('не указан ID в ссылке после /') }

      const profileIsExist = await pool.query('SELECT id FROM players WHERE id = $1', [id])

      if (profileIsExist.rows.length == 0) return

      // console.log(error)

      // const answerInfo = await pool.query('SELECT players.id as id, name, surname, status, city, EXTRACT( YEAR FROM birthday) AS bYear, base, forhand_pad, backhand_pad, max as r_max, min as r_min, current as r_current, delta as r_delta, timestamp FROM  players  JOIN rating_club ON players.id = rating_club.player_id  JOIN rating_flow ON players.id = rating_flow.player_id WHERE  players.id = $1 ORDER BY timestamp DESC', [id])

      const answerInfo = await pool.query('SELECT players.id as id, name, surname, status, city, EXTRACT( YEAR FROM birthday) AS b_Year, base, forhand_pad, backhand_pad FROM players WHERE players.id = $1', [id])
      // const answerRating = await pool.query('SELECT players.id as id, max as r_max, min as r_min, current as r_current, delta as r_delta, timestamp FROM  players  JOIN rating_club ON players.id = rating_club.player_id  JOIN rating_flow ON players.id = rating_flow.player_id WHERE players.id = $1 ORDER BY timestamp ASC', [id])
      const answerMatches = await pool.query('SELECT matches.id, games.fp_score,games.sp_score FROM matches JOIN games ON matches.id = games.match_id WHERE matches.first_player = $1', [id])

      const matches = answerMatches.rows.map(match => {
         return match.fp_score > match.sp_score
      })

      let wins = 0
      for (let i = 0; i < matches.length; i++) {
         if (matches[i]) wins += 1
      }
      let winsPersent = (wins / matches.length * 100).toFixed(2)
      winsPersent != 'NaN' ? winsPersent : winsPersent = 'пока нет побед'

      let grade = 'не оценен'
      if (winsPersent > 80) {
         grade = 'тотальный'
      } else if (winsPersent > 60) {
         grade = 'высокий'
      } else if (winsPersent > 40) {
         grade = 'нормальный'
      } else if (winsPersent <= 40) {
         grade = 'низкий'
      }

      return {
         id: answerInfo.rows[0].id,
         name: answerInfo.rows[0].name,
         surname: answerInfo.rows[0].surname,
         status: answerInfo.rows[0].status,
         city: answerInfo.rows[0].city,
         b_year: answerInfo.rows[0].b_year,
         winsPersent,
         grade,
         racket: {
            base: answerInfo.rows[0].base,
            forhand_pad: answerInfo.rows[0].forhand_pad,
            backhand_pad: answerInfo.rows[0].backhand_pad
         }
      }
   }
}

export default new ProfileService()
