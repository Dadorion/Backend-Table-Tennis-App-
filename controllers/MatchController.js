import MatchService from '../services/MatchService.js'

class MatchController {
   async create(req, res) {
      const match = req.body
      try {
         const newMatch = await MatchService.create(match)
         res.json(newMatch)

      } catch (e) {
         res.status(500).json(e)
         console.log(e)
      }
   }
   async getAll(req, res) {

      try {
         const allMatches = await MatchService.getAll()
         allMatches
            ? res.status(200).json(allMatches)
            : res.status(204).json('No result')
      } catch (e) {
         res.status(500).json(e)
         console.log(e)
      }
   }
   async getMatch(req, res) {
      try {
         const { id } = req.params
         if (!id) { res.status(400).json({ message: 'We need ID namber.' }) }
         const user = await MatchService.getOne(id)

         user
            ? res.status(200).json(match)
            : res.status(400).json('We have no such user')
      } catch (e) {
         res.status(500).json(e)
         console.log(e)
      }
   }
   // async update(req, res) {
   //    try {
   //       const { id } = req.body
   //       if (!id) { res.status(400).json({ message: 'We need ID namber.' }) }

   //       const updetedUser = await MatchService.update(req.body)

   //       res.status(200).json(updetedUser)
   //    } catch (e) {
   //       res.status(500).json(e.message)
   //    }
   // }
   // async delete(req, res) {
   //    try {
   //       const { id } = req.params
   //       if (!id) { res.status(400).json({ message: 'We need ID namber.' }) }

   //       const deletedUser = await MatchService.delete(id)

   //       deletedUser
   //          ? res.status(200).json(deletedUser)
   //          : res.status(400).json('We have no such user')
   //    } catch (e) {
   //       res.status(500).json(e)
   //    }
   // }
}

export default new MatchController
