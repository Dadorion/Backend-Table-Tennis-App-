import pool from '../database.js'
import Query from '../dataBuilders/queryBuilder.js'

class PlayerService {
   async create(player) {
      const { name, surname, birthday, status, city } = player

      const q = Query.insert('players', ['name', 'surname', 'birthday', 'status', 'city'])
      const newPlayer = await pool.query(q, [name, surname, birthday, status, city])

      return newPlayer
   }
   async getAll() {
      const answer = await pool.query('SELECT id, name, surname, birthday, status, city FROM players ORDER BY id DESC')
      let result =
      {
         "pagination":
         {
            "playersCount": answer.rows.length
         },

         "body": [...answer.rows]
      }

      return result
   }
   async getAllPredictive(findName) {
      const q = Query.selectAllPredictive('players', ["id", "name", "surname", "birthday", "status", "city"])
      const answer = await pool.query(q, [findName])
      let result =
      {
         "pagination":
         {
            "playersCount": answer.rows.length
         },

         "body": [...answer.rows]
      }

      return result
   }
   async getOne(id) {
      if (!id) { throw new Error('не указан ID') }

      const q = Query.selectID('players')
      const answer = await pool.query(q, [id])
      return answer.rows[0]
   }
   async update(player) {
      const { name, surname, birthday, status, city, id } = player

      const q = Query.insert('players', ['name', 'surname', 'birthday', 'status', 'city'])
      const updatedPlayer = await pool.query(q, [name, surname, birthday, status, city, id])

      return updatedPlayer.rows
   }
   async delete(id) {
      if (!id) { throw new Error('не указан ID') }

      const q = Query.selectID('players')
      const deletedPlayer = await pool.query(q, [id])
      return deletedPlayer.rows[0]
   }
}

export default new PlayerService()
