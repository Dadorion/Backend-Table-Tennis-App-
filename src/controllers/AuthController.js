import AuthService from "../services/AuthService.js";
import CityService from "../services/CityService.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { validationResult } from "express-validator";
import generateAccessToken from "../config/generateToken.js";

class AuthController {
  async checkBlackList(token) {
    const answer = await AuthService.blacklist(token);
    return answer;
  }
  async reg(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          message: "Полученные данные не прошли валидацию на сервере",
          errors: errors.array(),
        });
      }

      const { password_1, password_2, email, name, surname, birthday, city } =
        req.body;
      const candidate = await AuthService.getUser(email);

      if (candidate) {
        return res.status(409).json({
          error: "UserAlreadyExists",
          message: "Пользователь с указанными учетными данными уже существует",
        });
      }

      if (password_1 !== password_2) {
        return res.status(400).json({
          message: "Ошибка в подтверждении пароля",
        });
      }

      const saltRounds = 10;
      const hashPassword = await bcrypt.hash(password_1, saltRounds);

      let cityId = await CityService.getCityId(city);

      if (!cityId) {
        cityId = await CityService.addCity(city);
      }

      const user = await AuthService.addUser(
        email,
        name,
        surname,
        birthday,
        cityId,
        hashPassword
      );
      console.log(user);
      return res.json({
        message: `Пользователь ${name} ${surname} успешно зарегистрирован`,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        message: "Ошибка сервера при регистрации",
      });
    }
  }
  async updatePassword(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          message: "Полученные данные не прошли валидацию на сервере",
          errors: errors.array(),
        });
      }
      const { userId, playerId } = req.user;
      const { oldPassword, newPasswordOne, newPasswordTwo } = req.body;
      const user = await AuthService.getUserWithId(userId);

      if (!user) {
        return res.status(409).json({
          error: "UserNotExists",
          message: "Пользователь с указанным ID не существует",
        });
      }

      const saltRounds = 10;
      const oldPasswordBody = await bcrypt.hash(oldPassword, saltRounds);
      const oldPasswordDB = user.password;

      if (oldPasswordBody !== oldPasswordDB) {
        return res.status(400).json({
          message: "Указан неверный пароль",
        });
      }
      if (password_1 !== password_2) {
        return res.status(400).json({
          message: "Новые пароли не совпадают",
        });
      }

      const hashPassword = await bcrypt.hash(newPasswordOne, saltRounds);

      await AuthService.updatePassword(hashPassword, userId);
      return res.json({
        code: 0,
        message: `Пользователь ${name} ${surname} успешно зарегистрирован`,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        message: "Ошибка сервера при регистрации",
      });
    }
  }

  async login(req, res) {
    try {
      const { email, password } = req.body;
      const user = await AuthService.getUser(email);
      if (!user) {
        return res.status(400).json({
          message: `Пользователь с E-mail ${email} не найден`,
        });
      }
      const player = await AuthService.getPlayer(user.id);

      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) {
        return res.status(400).json({
          message: `Введен неверный пароль`,
        });
      }

      const token = generateAccessToken(user.id, player.id);
      return res.json(token);
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        message: "Ошибка сервера при попытке входа",
      });
    }
  }

  async logout(req, res) {
    try {
      const token = req.headers.authorization?.split(" ")[1];

      // Получение даты истечения срока действия токена (для очистки устаревших записей)
      const decodedToken = jwt.decode(token);
      const expiration = new Date(decodedToken.exp * 1000);

      // Добавление токена в черный список
      await AuthService.logout(token, expiration);

      res.json({
        code: 0,
        message: "Logout successful",
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }

  async me(req, res) {
    try {
      const { userId, playerId } = req.user;
      // получили id из пришедшие через мидлвар токен
      const answer = await AuthService.me(userId);
      if (!answer) {
        res.status(204).json("Нет ответа от сервера. <(-_-)>");
      } else {
        res.status(200).json(answer);
      }
    } catch (e) {
      res.status(500).json(`Перехваченная ошибка: ${e}`);
    }
  }
}

export default new AuthController();
