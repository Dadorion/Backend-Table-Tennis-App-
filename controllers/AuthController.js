import AuthService from '../serviceses/AuthService.js'
import bcrypt from 'bcryptjs'
import { validationResult } from 'express-validator'
import generateAccessToken from '../config/generateToken.js'


class AuthController {
   async reg(req, res) {
      try {

         // [ ] какие роли у нас будут?

         const errors = validationResult(req)
         if (!errors.isEmpty()) {
            return res.status(400).json({ message: "Ошибка при регистрации", errors })
         }

         const { password_1, password_2, email, name, surname, birthday, city } = req.body;
         const candidate = await AuthService.getUser(email)
         if (candidate) {
            return res.status(400).json({ message: "Пользователь с таким логином уже существует" })
         }

         let password
         if (password_1 !== password_2) { return res.status(400).json({ message: "Ошибка в подтверждении пароля" }) }
         else { password = password_1 }

         const salt = 7
         const hashPassword = bcrypt.hashSync(password, salt)

         const user = await AuthService.addUser(email, name, surname, birthday, city, hashPassword)
         console.log(user)
         return res.json({ message: `Пользователь ${name} ${surname} успешно зарегистрирован` })
      } catch (e) {
         console.log(e)
      }
   }
   async login(req, res) {
      try {
         const { email, password } = req.body;

         const user = await AuthService.getUser(email)
         if (!user) {
            return res.status(400).json({ message: `Пользователь с E-mail ${email} не найден` })
         }

         const validPassword = bcrypt.compareSync(password, user.password)
         if (!validPassword) {
            return res.status(400).json({ message: `Введен неверный пароль` })
         }
         const token = generateAccessToken(user.id)
         console.log(token)
         return res.json({ token })
      } catch (e) {
         console.log(e)
      }
   }
}

export default new AuthController
