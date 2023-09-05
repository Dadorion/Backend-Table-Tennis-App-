import jwt from 'jsonwebtoken'
import config from '../config/config.js'

export default function authMiddleware(req, res, next) {
   if (req.method === "OPTIONS") {
      next()
   }

   try {
      const fullToken = req.headers.authorization
      if (!fullToken) {
         return res.status(403).json({ message: "Пользователь не авторизован. Токен не получен" })
      }
      const token = req.headers.authorization.split(' ')[1]
      const decodedData = jwt.verify(token, config.secret)
      req.user = decodedData
      next()
   } catch (e) {
      console.log(e)
      return res.status(403).json({ message: "Пользователь не авторизован" })
   }
}
