import AuthService from '../services/AuthService.js'
import bcrypt from 'bcryptjs'
import { validationResult } from 'express-validator'
import generateAccessToken from '../config/generateToken.js'

class AuthController {
   async reg(req, res) {
      try {
         const errors = validationResult(req)
         if (!errors.isEmpty()) {
            return res.status(400).json({ message: "Ошибка при регистрации", errors: errors.array() })
         }

         const { password_1, password_2, email, name, surname, birthday, city } = req.body
         const candidate = await AuthService.getUser(email)

         if (candidate) {
            return res.status(400).json({ message: "Пользователь с таким логином уже существует" })
         }

         if (password_1 !== password_2) {
            return res.status(400).json({ message: "Ошибка в подтверждении пароля" })
         }

         const saltRounds = 10 // количество раундов 
         const hashPassword = await bcrypt.hash(password_1, saltRounds)

         const user = await AuthService.addUser(email, name, surname, birthday, city, hashPassword)
         console.log(user)
         return res.json({ message: `Пользователь ${name} ${surname} успешно зарегистрирован` })
      } catch (error) {
         console.error(error)
         return res.status(500).json({ message: "Ошибка сервера при регистрации" })
      }
   }

   async login(req, res) {
      try {
         const { email, password } = req.body

         const user = await AuthService.getUser(email)
         if (!user) {
            return res.status(400).json({ message: `Пользователь с E-mail ${email} не найден` })
         }

         const validPassword = await bcrypt.compare(password, user.password)
         if (!validPassword) {
            return res.status(400).json({ message: `Введен неверный пароль` })
         }

         const token = generateAccessToken(user.id)
         console.log(token)
         return res.json({ token })
      } catch (error) {
         console.error(error)
         return res.status(500).json({ message: "Ошибка сервера при попытке входа" })
      }
   }
}

export default new AuthController()
