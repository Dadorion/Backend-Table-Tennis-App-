import pool from '../database.js'

class AuthService {

   async getUser(email) {
      const q = `SELECT * FROM users WHERE email = $1`
      const answer = await pool.query(q, [email])
      return answer.rows[0]
   }


   async addUser(email, name, surname, birthday, city, hashPassword) {
      const client = await pool.connect();
      try {
         await client.query('BEGIN');

         // Вставляем пользователя и получаем его id
         const userResult = await client.query(
            'INSERT INTO users (email, password) VALUES ($1, $2) RETURNING id',
            [email, hashPassword]
         );

         const userId = userResult.rows[0].id;

         // Вставляем игрока, используя userId из предыдущей операции
         const playerResult = await client.query(
            'INSERT INTO players (name, surname, birthday, city, user_id) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [name, surname, birthday, city, userId]
         );

         const authRole = 1 // Назначаем роль player - not admin
         await client.query(
            'INSERT INTO auth_role_users (auth_role_id, user_id) VALUES ($1, $2)',
            [authRole, userId]
         );

         await client.query('COMMIT'); // Завершаем транзакцию

         return { user: userResult.rows[0], player: playerResult.rows[0] };
      } catch (error) {
         await client.query('ROLLBACK'); // Откатываем транзакцию при ошибке
         throw error; // Передаем ошибку наверх для обработки
      } finally {
         client.release(); // Возвращаем клиента в пул соединений
      }
   }
}

export default new AuthService()
