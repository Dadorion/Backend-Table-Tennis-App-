import { Router } from "express"
import AuthController from "../controllers/AuthController.js"
import { check } from "express-validator"

const routerAuth = new Router()
// TODO что-то надо решить на счет восстановления пароля, если пользователь его забыл

const today = new Date;

routerAuth.post
   (
      '/registration',
      [
         check('password_1', "Пароль должен быть больше 4 и меньше 10 символов").trim().isLength({ min: 4, max: 10 }),
         check('password_2', "Пароль должен быть больше 4 и меньше 10 символов").trim().isLength({ min: 4, max: 10 }),
         check('email', "Введите корректный E-mail").trim().isEmail(),
         check('name', "Имя должно быть длинее 3 и короче 15 символов").trim().isLength({ min: 3, max: 15 }),
         check('surname', "Фамилия должна быть длинее 3 и короче 20 символов").trim().isLength({ min: 3, max: 20 }),
         // check('birthday', "Введите корректную дату. Вы должны быть старше 5 лет").trim().isDate().isBefore(today.setFullYear(today.getFullYear() - 5)),
         check('birthday', "Введите корректную дату. Вы должны быть старше 5 лет").custom(value => { if (new Date(value).getTime() < today.getTime()) { return true } else { return false } }),
         check('city', "Город должен быть больше 2 и меньше 23 символов").trim().isLength({ min: 2, max: 23 }),
      ],
      AuthController.reg
   )

routerAuth.post('/login', AuthController.login)

export default routerAuth
