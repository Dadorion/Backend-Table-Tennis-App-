import ProfileService from "../services/ProfileService.js";
import { fs } from "file-system";

class ProfileController {
  async getOne(req, res) {
    try {
      const { id } = req.params;
      if (!id) {
        res.status(400).json({ message: "не указан ID в ссылке после /" });
      }
      const profile = await ProfileService.getOne(id);

      profile
        ? res.status(200).json(profile)
        : res.status(400).json("пользователь с таким ID не найден");
    } catch (e) {
      res.status(500).json(e.message);
    }
  }
  async getMyProfile(req, res) {
    try {
      const { userId, playerId } = req.user;
      const answer = await ProfileService.getMyProfile(playerId);
      if (!answer) {
        res.status(204).json("Нет ответа от сервера. <(-_-)>");
      } else {
        res.status(200).json(answer);
      }
    } catch (e) {
      res.status(500).json(`Перехваченная ошибка: ${e}`);
    }
  }
  async updateMyProfile(req, res) {
    try {
      const { userId, playerId } = req.user;
      const newProfileData = req.body;
      const answer = await ProfileService.updateMyProfile(
        playerId,
        newProfileData
      );
      if (!answer) {
        res.status(204).json("Нет ответа от сервера. <(-_-)>");
      } else {
        res.status(200).json(answer);
      }
    } catch (e) {
      res.status(500).json(`Перехваченная ошибка: ${e}`);
    }
  }
  async updateMyStatus(req, res) {
    try {
      const { userId, playerId } = req.user;
      const statusText = req.body.status;
      const answer = await ProfileService.updateMyStatus(playerId, statusText);
      if (!answer) {
        res.status(204).json("Нет ответа от сервера. <(-_-)>");
      } else {
        res.status(200).json(answer);
      }
    } catch (e) {
      res.status(500).json(`Перехваченная ошибка: ${e}`);
    }
  }
  async uploadPhoto(req, res) {
    try {

      if (!req.file) {
        return res.status(400).send({ code: 1, message: "No file uploaded" });
      }

      const { userId, playerId } = req.user;
      const filePath = req.file.path;

      let previousPhotoPath = await ProfileService.getMyProfile(playerId)
      previousPhotoPath = previousPhotoPath.photo_path

      if (previousPhotoPath) {
        // Удаляем файл предыдущей фотографии.
        fs.unlinkSync(previousPhotoPath);
      }

      await ProfileService.updateMyPhoto(playerId, filePath);

      res.status(200).send({ code: 0, message: "File uploaded!" });
    } catch (error) {
      res.status(500).send({ code: 1, message: "File upload failed." });
    }
  }
}

export default new ProfileController();
