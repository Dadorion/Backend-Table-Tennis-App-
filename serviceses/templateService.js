import client from '../database.js'
import Query from '../queryBilder.js'

await client.connect()

class CompetitionService {
   // async create(competition) {
   //    const { fp_user_id, sp_user_id, date, tournament_id, location_id, winner } = competition

   //    const newCompetition = await client.query('INSERT INTO competitions (fp_user_id, sp_user_id, date, tournament_id, location_id, winner) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *', [fp_user_id, sp_user_id, date, tournament_id, location_id, winner])

   //    return newCompetition
   // }
   async create(competition) {
      const { fp_user_id, sp_user_id, date, tournament_id, location_id, winner } = competition

      const newCompetition = await client.query(
         Query({ type: 'INSERT', table: 'competition', columns: ['fp_user_id', 'sp_user_id', 'date', 'tournament_id', 'location_id', 'winner'] }).qString,
         [fp_user_id, sp_user_id, date, tournament_id, location_id, winner])

      return newCompetition
   }
   // async getAll() {
   //    const answer = await client.query('SELECT * FROM competitions ORDER BY id DESC')
   //    console.log(answer.rows)
   //    return answer.rows
   // }
   async getAll() {
      const q = Query.selectAll('competitions')
      const answer = await client.query(q)
      return answer.rows
   }
   async getOne(id) {
      if (!id) { throw new Error('не указан ID') }

      const answer = await client.query('SELECT * FROM competitions WHERE id = $1', [id])
      return answer.rows[0]
   }
   async update(competition) {
      const { fp_user_id, sp_user_id, date, tournament_id, location_id, winner, id } = competition

      const updetedCompetition = await client.query('UPDATE competitions SET fp_user_id = $1, sp_user_id = $2, date = $3, tournament_id = $4, location_id = $5, winner = $6 WHERE id = $7 RETURNING *', [fp_user_id, sp_user_id, date, tournament_id, location_id, winner, id])

      return updetedCompetition.rows
   }
   async delete(id) {
      if (!id) { throw new Error('не указан ID') }

      const deletedCompetition = await client.query('DELETE FROM competitions WHERE id = $1 RETURNING *', [id])
      return deletedCompetition.rows[0]
   }
}

export default new CompetitionService()