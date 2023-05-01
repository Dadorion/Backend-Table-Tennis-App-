import NotificationService from '../serviceses/NotificationService.js'

class NotificationController {
   async create(req, res) {
      try {
         const newNotification = await NotificationService.create(req.body)
         res.json(newNotification.rows[0])

      } catch (e) {
         res.status(500).json(e)
         console.log(e)
      }
   }
   async getAll(req, res) {
      try {
         const allNotification = await NotificationService.getAll()
         allNotification
            ? res.status(200).json(allNotification)
            : res.status(204).json('This table is empty')
      } catch (e) {
         res.status(500).json(e)
      }
   }
   // async getOne(req, res) {
   //    try {
   //       const { id } = req.params
   //       if (!id) { res.status(400).json({ message: 'We need ID namber.' }) }
   //       const notification = await NotificationService.getOne(id)

   //       notification
   //          ? res.status(200).json(notification)
   //          : res.status(400).json('We have no such notification')
   //    } catch (e) {
   //       res.status(500).json(e)
   //       console.log(e)
   //    }
   // }
   async getAllForOnePlayer(req, res) {
      try {
         const { id } = req.params
         if (!id) { res.status(400).json({ message: 'We need ID namber.' }) }
         const notification = await NotificationService.getAllForOnePlayer(id)

         notification
            ? res.status(200).json(notification)
            : res.status(400).json('We have no such notification')
      } catch (e) {
         res.status(500).json(e)
         console.log(e)
      }
   }
   async update(req, res) {
      try {
         const { id } = req.body
         if (!id) { res.status(400).json({ message: 'We need ID namber.' }) }

         const updetedNotification = await NotificationService.update(req.body)

         res.status(200).json(updetedNotification)
      } catch (e) {
         res.status(500).json(e.message)
      }
   }
   async delete(req, res) {
      try {
         const { id } = req.params
         if (!id) { res.status(400).json({ message: 'We need ID namber.' }) }

         const deletedNotification = await NotificationService.delete(id)

         deletedNotification
            ? res.status(200).json(deletedNotification)
            : res.status(400).json('We have no such notification')
      } catch (e) {
         res.status(500).json(e)
         // console.log(e)
      }
   }
}

export default new NotificationController
