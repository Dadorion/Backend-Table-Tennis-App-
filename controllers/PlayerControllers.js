import PlayerService from '../services/PlayerService.js'

class PlayerController {
   checkId(id) {
      if (!id) {
         throw new Error('We need an ID number.')
      }
   }

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
         const answer = await PlayerService.getAll()
         const allPlayers = answer.body
         const paginationInfo = answer.pagination

         if (allPlayers.length < 1) {
            return res.status(204).json('This table is empty')
         }

         const allPlayersTop = allPlayers.map((player) => {
            const filteredPlayers = allPlayers.filter((p) => p.city !== player.city)
            const ratingPlace = filteredPlayers.findIndex((p) => p.id === player.id) + 1
            return { ...player, ratingPlace }
         })
         // FIXME топ игроков вообще не работает. мы пытаемся фильтровать не понятно что не понятно по каким условиям и не понятно зачем
         // по идее надо фильтровать по количеству побед или по проценту побед.
         const apt = { pagination: paginationInfo, body: allPlayersTop }

         res.status(200).json(apt)
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
         this.checkId(id)
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
         this.checkId(id)

         const updetedPlayer = await PlayerService.update(req.body)

         res.status(200).json(updetedPlayer)
      } catch (e) {
         res.status(500).json(e.message)
      }
   }
   async delete(req, res) {
      try {
         const { id } = req.params
         this.checkId(id)

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
