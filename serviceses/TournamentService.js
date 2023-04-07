import client from '../database.js'
import Query from '../queryBilder.js'

// await client.connect()

class TournamentService {
   async create(tournament) {
      const { fp_user_id, sp_user_id, date, tournament_id, location_id, winner } = tournament

      const q = Query.insert('competitions', ['fp_user_id', 'sp_user_id', 'date', 'tournament_id', 'location_id', 'winner'])
      const newTournament = await client.query(q, [fp_user_id, sp_user_id, date, tournament_id, location_id, winner])

      return newTournament
   }
   async getAll() {
      const q = Query.selectAll('tournaments')
      const answer = await client.query(q)
      return answer.rows
   }
   async getOne(id) {
      if (!id) { throw new Error('не указан ID') }

      const q = Query.selectID('tournaments')
      const answer = await client.query(q, [id])
      return answer.rows[0]
   }
   async update(tournament) { //еще не проверил на работоспособность
      const { fp_user_id, sp_user_id, date, tournament_id, location_id, winner, id } = tournament

      const q = Query.selectID('tournaments', ['fp_user_id', 'sp_user_id', 'date', 'tournament_id', 'location_id', 'winner'], id)

      const updetedCompetition = await client.query(q, [fp_user_id, sp_user_id, date, tournament_id, location_id, winner, id])

      return updetedCompetition.rows
   }
   async delete(id) {
      if (!id) { throw new Error('не указан ID') }

      const deletedTournament = await client.query('DELETE FROM tournament WHERE id = $1 RETURNING *', [id])
      return deletedTournament.rows[0]
   }
}

export default new TournamentService()