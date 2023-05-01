import CompetitionService from '../serviceses/CompetitionService.js'

class CompetitionController {
   async create(req, res) {
      try {
         const newCompetition = await CompetitionService.create(req.body)
         res.json(newCompetition.rows[0])

      } catch (e) {
         res.status(500).json(e)
         console.log(e)
      }
   }
   async getAll(req, res) {
      try {
         const allCompetition = await CompetitionService.getAll()
         allCompetition
            ? res.status(200).json(allCompetition)
            : res.status(204).json('This table is empty')
      } catch (e) {
         res.status(500).json(e)
      }
   }
   async getOne(req, res) {
      try {
         const { id } = req.params
         if (!id) { res.status(400).json({ message: 'We need ID namber.' }) }
         const competition = await CompetitionService.getOne(id)

         competition
            ? res.status(200).json(competition)
            : res.status(400).json('We have no such competition')
      } catch (e) {
         res.status(500).json(e)
         console.log(e)
      }
   }
   async update(req, res) {
      try {
         const { id } = req.body
         if (!id) { res.status(400).json({ message: 'We need ID namber.' }) }

         const updetedCompetition = await CompetitionService.update(req.body)

         res.status(200).json(updetedCompetition)
      } catch (e) {
         res.status(500).json(e.message)
      }
   }
   async delete(req, res) {
      try {
         const { id } = req.params
         if (!id) { res.status(400).json({ message: 'We need ID namber.' }) }

         const deletedCompetition = await CompetitionService.delete(id)

         deletedCompetition
            ? res.status(200).json(deletedCompetition)
            : res.status(400).json('We have no such competition')
      } catch (e) {
         res.status(500).json(e)
         // console.log(e)
      }
   }
}

export default new CompetitionController
