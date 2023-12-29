import pool from '../../database.js'

export default async function checkUserRoleMiddleware(req, res, next) {
   const allowedRoles = ['admin']

   if (req.method === "OPTIONS") { next() }

   try {
      const userId = req.user.id
      const userRole = (await pool.query(
         `SELECT
            users.id,
            role
         FROM
            users
            JOIN auth_role_users ON auth_role_users.user_id = users.id
            JOIN auth_role ON auth_role_users.auth_role_id = auth_role.id
         WHERE
            users.id = $1`, [userId])).rows[0].role

      if (!allowedRoles.includes(userRole)) res.status(403).json({ error: 'Access denied' })
      next()
   } catch (e) {
      console.log(e.message)
      return res.status(403).json({ message: "Пользователь не является админом" })
   }
}
