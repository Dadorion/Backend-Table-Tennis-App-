import pool from '../database.js'

class AuthService {

   async getUser(email) {
      const q = `SELECT * FROM users WHERE email = $1`
      const answer = await pool.query(q, [email])
      return answer.rows[0]
   }

   async addUser(email, name, surname, birthday, city, hashPassword) {
      // FIXME: Как-то зашкварно это место выглядит. Надо запрос отправлять одним блоком. И ошибки обрабатывать так же. Сейчас может так случиться, что юзер пропишется в базе, а плеер нет. При повторной попытке ввести данные сервак скажет, что юзер уже существует.
      const qUser = `INSERT INTO users (email, password) VALUES ($1, $2) RETURNING *`
      const answerUser = await pool.query(qUser, [email, hashPassword])

      const qPlayer = `INSERT INTO players (name, surname, birthday, city, user_id) VALUES ($1, $2, $3, $4, $5) RETURNING *`
      const answerPlayer = await pool.query(qPlayer, [name, surname, birthday, city, answerUser.rows[0].id])

      return { user: answerUser.rows[0], player: answerPlayer.rows[0] }
   }
}

export default new AuthService()
