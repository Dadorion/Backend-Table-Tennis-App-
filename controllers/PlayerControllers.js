import PlayerService from '../serviceses/PlayerService.js'

class PlayerController {
   async create(req, res) {
      try {
         const newPlayer = await PlayerService.create(req.body)
         res.json(newPlayer.rows[0])

      } catch (e) {
         res.status(500).json(e)
         console.log(e)
      }
   }
   async getAll(req, res) {
      try {
         const allPlayer = await PlayerService.getAll()
         allPlayer
            ? res.status(200).json(allPlayer)
            : res.status(204).json('This table is empty')
      } catch (e) {
         res.status(500).json(e)
      }
   }
   async getOne(req, res) {
      try {
         const { id } = req.params
         if (!id) { res.status(400).json({ message: 'We need ID namber.' }) }
         const player = await PlayerService.getOne(id)

         player
            ? res.status(200).json(player)
            : res.status(400).json('We have no such player')
      } catch (e) {
         res.status(500).json(e)
         console.log(e)
      }
   }
   async update(req, res) {
      try {
         const { id } = req.body
         if (!id) { res.status(400).json({ message: 'We need ID namber.' }) }

         const updetedPlayer = await PlayerService.update(req.body)

         res.status(200).json(updetedPlayer)
      } catch (e) {
         res.status(500).json(e.message)
      }
   }
   async delete(req, res) {
      try {
         const { id } = req.params
         if (!id) { res.status(400).json({ message: 'We need ID namber.' }) }

         const deletedPlayer = await PlayerService.delete(id)

         deletedPlayer
            ? res.status(200).json(deletedPlayer)
            : res.status(400).json('We have no such player')
      } catch (e) {
         res.status(500).json(e)
         // console.log(e)
      }
   }
}

export default new PlayerController   