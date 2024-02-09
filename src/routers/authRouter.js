import { Router } from "express";
import AuthController from "../controllers/AuthController.js";
import { check } from "express-validator";
import authMiddleware from "../middleware/authMiddleware.js";

const routerAuth = new Router();

const today = new Date();
routerAuth.post(
  "/registration",
  [
    check("password_1", "Пароль должен быть больше 10 и меньше 4 символов")
      .trim()
      .isLength({
        min: 4,
        max: 10,
      }),
    check("password_2", "Пароль должен быть больше 10 и меньше 4 символов")
      .trim()
      .isLength({
        min: 4,
        max: 10,
      }),
    check("email", "Введите корректный E-mail").trim().isEmail(),
    check("name", "Имя должно быть длиннее 3 и короче 15 символов")
      .trim()
      .isLength({
        min: 3,
        max: 15,
      }),
    check("surname", "Фамилия должна быть длиннее 3 и короче 20 символов")
      .trim()
      .isLength({
        min: 3,
        max: 20,
      }),
    check(
      "birthday",
      "Введите корректную дату. Вы должны быть старше 5 лет"
    ).custom((value) => {
      if (new Date(value).getTime() < today.getTime()) {
        return true;
      } else {
        return false;
      }
    }),
    check("city", "Город должен быть больше 2 и меньше 23 символов")
      .trim()
      .isLength({
        min: 2,
        max: 23,
      }),
  ],
  AuthController.reg
);

routerAuth.post("/login", AuthController.login);
routerAuth.delete("/login", AuthController.logout);
routerAuth.get("/me", authMiddleware, AuthController.me);
routerAuth.put(
  "/update_my_password",
  authMiddleware,
  [
    check("newPasswordOne", "Пароль должен быть длиннее 4 и короче 10 символов")
      .trim()
      .isLength({
        min: 4,
        max: 10,
      }),
    check("newPasswordTwo", "Пароль должен быть длиннее 4 и короче 10 символов")
      .trim()
      .isLength({
        min: 4,
        max: 10,
      }),
  ],
  AuthController.updatePassword
);

export default routerAuth;
