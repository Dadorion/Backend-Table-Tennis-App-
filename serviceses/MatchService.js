import pool from '../database.js'
import Query from '../queryBuilder.js'

class MatchService {
   // async create(user) {
   //    const { name, surname, birthday, status, city } = user

   //    const q = Query.insert('players', ['name', 'surname', 'birthday', 'status', 'city'])
   //    const newPlayer = await pool.query(q, [name, surname, birthday, status, city])

   //    return newPlayer
   // }
   async getAll() {
      const q = Query.selectAll('matches')
      const answer = await pool.query(q)
      return answer.rows
   }
   // async getOne(id) {
   //    if (!id) { throw new Error('не указан ID') }

   //    const q = Query.selectID('players')
   //    const answer = await pool.query(q, [id])
   //    return answer.rows[0]
   // }
   // async update(user) {
   //    const { name, surname, birthday, status, city, id } = user

   //    const q = Query.insert('players', ['name', 'surname', 'birthday', 'status', 'city'])
   //    const updetedPlayer = await pool.query(q, [name, surname, birthday, status, city, id])

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
