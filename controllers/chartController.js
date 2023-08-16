import PlayerService from '../services/PlayerService.js'

class PlayerController {
   async create(req, res) {
      try {
         const newPlayer = await PlayerService.create(req.body)
         res.json(newPlayer.rows[0])

      } catch (e) {
         res.status(500).json(e)
      }
   }
   async getAll(req, res) {
      try {
         const allPlayers = await PlayerService.getAll()
         // console.log(allPlayers)
         if (allPlayers.length < 1) return res.status(500).json('sevrice not sent any answer')
         const allPlayersTop = allPlayers.map((player) => {
            const x = []
            for (let i = 0; i < allPlayers.length; i++) {

               if (player.city !== allPlayers[i].city) return
               x.push(allPlayers[i])

            }

            let ratPlayer = { ...player, ratingPlace: x.findIndex(p => p.id === player.id) + 1 }
            return ratPlayer

         })

         allPlayersTop
            ? res.status(200).json(allPlayersTop)
            : res.status(204).json('This table is empty')
      } catch (e) {
         res.status(500).json(e)
      }
   }
   async getAllPredictive(req, res) {
      try {
         const { name } = req.body
         const findName = `${name}%`
         const allPlayers = await PlayerService.getAllPredictive(findName)

         allPlayers
            ? res.status(200).json(allPlayers)
            : res.status(204).json('Start to whrite a name')
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
      }
   }
}

export default new PlayerController
