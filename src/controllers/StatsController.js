import StatsService from '../services/StatsService.js'

class StatsController {
   async getOne(req, res) {
      try {
         const { id } = req.params
         if (!id) { res.status(400).json({ message: 'не указан ID в ссылке после /' }) }
         const profile = await StatsService.getOne(id)


         profile
            ? res.status(200).json(profile)
            : res.status(400).json('пользователь с таким ID не найден')
      } catch (e) {
         res.status(500).json(e.message)
      }
   }
}

export default new StatsController
