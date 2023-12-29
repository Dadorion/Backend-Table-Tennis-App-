import { Router } from "express"
import MatchController from "../controllers/MatchController.js"

const matchRouter = new Router()

/*
Инфа с главной страницы / счетчика:
__ по сути инфа о новой встрече __
- дата проведения ( по умолчанию сегодня )
- локация
- из скольки партий встреча
- кто играет: 1й, 2й
   -1й - указавается из профиля игрока (уже известен клиенту)
   -2й - ищется в БД (и тут нужен функционал поиска с предиктивом). фильтруем:
      -по алфавиту
      -по количеству проведенных ранее встреч
   -если игрока в базе не нашлось - добавляем нового (призрака)
-И это уже сомодостаточная встреча без сыграных партий
-далее будут указываться счета партий. но пришиваться в этой встрече
*/

matchRouter.post('/new', MatchController.create)
matchRouter.post('/', MatchController.getAll)
matchRouter.get('/:id', MatchController.getPlayerMatches)
// matchRouter.get('/:id', MatchController.getOne)
// matchRouter.post('/', MatchController.update)
// matchRouter.get('/:id', MatchController.delete)

export default matchRouter
