import PlayerService from '../services/PlayerService.js';

class PlayerController {
   checkId(id) {
      if (!id) {
         throw new Error('We need an ID number.');
      }
   }

   async create(req, res) {
      try {
         const newPlayer = await PlayerService.create(req.body);
         res.json(newPlayer.rows[0]);

      } catch (e) {
         res.status(500).json({ error: e.message });
      }
   }

   async getAll(req, res) {
      try {
         const allPlayersResponse = await PlayerService.getAll();
         const allPlayers = allPlayersResponse.body;
         const paginationInfo = allPlayersResponse.pagination;

         if (allPlayers.length < 1) {
            return res.status(204).json('This table is empty');
         }

         const allPlayersTop = allPlayers.map((player) => {
            const filteredPlayers = allPlayers.filter((p) => p.city !== player.city);
            const ratingPlace = filteredPlayers.findIndex((p) => p.id === player.id) + 1;
            return { ...player, ratingPlace };
         });

         res.status(200).json({ pagination: paginationInfo, body: allPlayersTop });
      } catch (e) {
         res.status(500).json({ error: e.message });
      }
   }

   async getAllPredictive(req, res) {
      try {
         const { name } = req.query;
         if (!name) {
            return res.status(204).json('Start to write a name');
         }

         const findName = `${name}%`;
         const allPlayers = await PlayerService.getAllPredictive(findName);

         res.status(200).json(allPlayers);
      } catch (e) {
         res.status(500).json({ error: e.message });
      }
   }

   async getOne(req, res) {
      try {
         console.log(req);
         const { id } = req.params;
         this.checkId(id);
         const player = await PlayerService.getOne(id);
         
         if (player) {
            res.status(200).json(player);
         } else {
            res.status(400).json('We have no such player');
         }
      } catch (e) {
         console.log("Ошибка");
         res.status(500).json({ error: e.message });
      }
   }

   async update(req, res) {
      try {
         const { id } = req.body;
         this.checkId(id);

         const updatedPlayer = await PlayerService.update(req.body);

         res.status(200).json(updatedPlayer);
      } catch (e) {
         res.status(500).json({ error: e.message });
      }
   }

   async delete(req, res) {
      try {
         const { id } = req.params;
         this.checkId(id);

         const deletedPlayer = await PlayerService.delete(id);

         if (deletedPlayer) {
            res.status(200).json(deletedPlayer);
         } else {
            res.status(400).json('We have no such player');
         }
      } catch (e) {
         res.status(500).json({ error: e.message });
      }
   }
}

export default new PlayerController();
