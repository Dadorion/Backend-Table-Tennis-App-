import jwt from "jsonwebtoken";
import config from "../config/config.js";
import AuthController from "../controllers/AuthController.js";

export default function authMiddleware(req, res, next) {
  if (req.method === "OPTIONS") {
    next();
  }

  try {
    const fullToken = req.headers.authorization;
    if (!fullToken) {
      return res.status(403).json({
        message: "Пользователь не авторизован. Токен не получен",
      });
    }
    const token = fullToken.split(" ")[1];

    const intoBlackList = AuthController.checkBlackList(token);

    if (intoBlackList.length > 0) {
      res.status(401).json({ error: "Token revoked" });
    }

    const decodedData = jwt.verify(token, config.secret);
    req.user = decodedData;
    next();
  } catch (e) {
    console.log(e);
    return res.status(403).json({
      message: "Пользователь не авторизован",
    });
  }
}
