import client from '../database.js'
import Query from '../queryBuilder.js'

// await client.connect()

class CompetitionService {
   // async create(competition) {
   //    const { fp_user_id, sp_user_id, date, tournament_id, location_id, winner } = competition

   //    const newCompetition = await client.query('INSERT INTO competitions (fp_user_id, sp_user_id, date, tournament_id, location_id, winner) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *', [fp_user_id, sp_user_id, date, tournament_id, location_id, winner])

   //    return newCompetition
   // }
   async create(competition) {
      const { fp_user_id, sp_user_id, date, tournament_id, location_id, winner } = competition

      const q = Query.insert('competitions', ['fp_user_id', 'sp_user_id', 'date', 'tournament_id', 'location_id', 'winner'])
      const newCompetition = await client.query(q, [fp_user_id, sp_user_id, date, tournament_id, location_id, winner])

      return newCompetition
   }
   // async getAll() {
   //    const q = Query.selectAll('competitions')
   //    const answer = await client.query(q)
   //    return answer.rows
   // }
   async getAll() {
      const answer = await client.query('SELECT players_competitions.id as id, competitions.id as competition_id, date, name, surname, score FROM players_competitions JOIN players ON players.id = player_id JOIN competitions ON competitions.id = competition_id ORDER BY id DESC LIMIT 10')
      return answer.rows
   }
   async getOne(id) {
      if (!id) { throw new Error('не указан ID') }

      const q = Query.selectID('competitions')
      const answer = await client.query(q, [id])
      return answer.rows[0]
   }
   async update(competition) { //еще не проверил на работоспособность
      const { fp_user_id, sp_user_id, date, tournament_id, location_id, winner, id } = competition

      const q = Query.selectID('competitions', ['fp_user_id', 'sp_user_id', 'date', 'tournament_id', 'location_id', 'winner'], id)

      const updetedCompetition = await client.query(q, [fp_user_id, sp_user_id, date, tournament_id, location_id, winner, id])

      return updetedCompetition.rows
   }
   async delete(id) {
      if (!id) { throw new Error('не указан ID') }

      const deletedCompetition = await client.query('DELETE FROM competitions WHERE id = $1 RETURNING *', [id])
      return deletedCompetition.rows[0]
   }
}

export default new CompetitionService()
