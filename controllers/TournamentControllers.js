import TournamentService from '../serviceses/TournamentService.js'

class TournamentController {
   async create(req, res) {
      try {
         const newTournament = await TournamentService.create(req.body)
         res.json(newTournament.rows[0])

      } catch (e) {
         res.status(500).json(e)
         console.log(e)
      }
   }
   async getAll(req, res) {
      try {
         const allTournament = await TournamentService.getAll()
         allTournament
            ? res.status(200).json(allTournament)
            : res.status(204).json('This table is empty')
      } catch (e) {
         res.status(500).json(e)
      }
   }
   async getOne(req, res) {
      try {
         const { id } = req.params
         if (!id) { res.status(400).json({ message: 'We need ID namber.' }) }
         const tournament = await TournamentService.getOne(id)

         tournament
            ? res.status(200).json(tournament)
            : res.status(400).json('We have no such tournament')
      } catch (e) {
         res.status(500).json(e)
         console.log(e)
      }
   }
   async update(req, res) {
      try {
         const { id } = req.body
         if (!id) { res.status(400).json({ message: 'We need ID namber.' }) }

         const updetedTournament = await TournamentService.update(req.body)

         res.status(200).json(updetedTournament)
      } catch (e) {
         res.status(500).json(e.message)
      }
   }
   async delete(req, res) {
      try {
         const { id } = req.params
         if (!id) { res.status(400).json({ message: 'We need ID namber.' }) }

         const deletedTournament = await TournamentService.delete(id)

         deletedTournament
            ? res.status(200).json(deletedTournament)
            : res.status(400).json('We have no such tournament')
      } catch (e) {
         res.status(500).json(e)
         // console.log(e)
      }
   }
}

export default new TournamentController
