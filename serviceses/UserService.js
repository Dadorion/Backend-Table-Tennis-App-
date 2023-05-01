import client from '../database.js'
import Query from '../queryBuilder.js'

await client.connect()

class UserService {
   // async create(user) {
   //    const { name, surname, birthday, status, city } = user

   //    const q = Query.insert('players', ['name', 'surname', 'birthday', 'status', 'city'])
   //    const newPlayer = await client.query(q, [name, surname, birthday, status, city])

   //    return newPlayer
   // }
   // async getAll() {
   //    const q = Query.selectAll('players')
   //    const answer = await client.query(q)
   //    return answer.rows
   // }
   // async getOne(id) {
   //    if (!id) { throw new Error('не указан ID') }

   //    const q = Query.selectID('players')
   //    const answer = await client.query(q, [id])
   //    return answer.rows[0]
   // }
   // async update(user) {
   //    const { name, surname, birthday, status, city, id } = user

   //    const q = Query.insert('players', ['name', 'surname', 'birthday', 'status', 'city'])
   //    const updetedPlayer = await client.query(q, [name, surname, birthday, status, city, id])

   //    return updetedPlayer.rows
   // }
   // async delete(id) {
   //    if (!id) { throw new Error('не указан ID') }

   //    const q = Query.selectID('players')
   //    const deletedPlayer = await client.query(q, [id])
   //    return deletedPlayer.rows[0]
   // }
}

export default new UserService()
