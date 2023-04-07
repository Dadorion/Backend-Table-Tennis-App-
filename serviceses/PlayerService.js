import client from '../database.js'
import Query from '../queryBilder.js'

// await client.connect()

class PlayerService {
   async create(player) {
      const { name, surname, birthday, status, city } = player

      const q = Query.insert('players', ['name', 'surname', 'birthday', 'status', 'city'])
      const newPlayer = await client.query(q, [name, surname, birthday, status, city])

      return newPlayer
   }
   // async getAll() {
   //    const q = Query.selectAll('players')
   //    const answer = await client.query(q)
   //    return answer.rows
   // }
   async getAll() {
      const answer = await client.query('SELECT players.id, name, surname, birthday, status, city, max, min, current FROM players JOIN rating_club ON players.id = rating_club.player_id ORDER BY current DESC')
      return answer.rows
   }
   async getOne(id) {
      if (!id) { throw new Error('не указан ID') }

      const q = Query.selectID('players')
      const answer = await client.query(q, [id])
      return answer.rows[0]
   }
   async update(player) {
      const { name, surname, birthday, status, city, id } = player

      const q = Query.insert('players', ['name', 'surname', 'birthday', 'status', 'city'])
      const updatedPlayer = await client.query(q, [name, surname, birthday, status, city, id])

      return updatedPlayer.rows
   }
   async delete(id) {
      if (!id) { throw new Error('не указан ID') }

      const q = Query.selectID('players')
      const deletedPlayer = await client.query(q, [id])
      return deletedPlayer.rows[0]
   }
}

export default new PlayerService()