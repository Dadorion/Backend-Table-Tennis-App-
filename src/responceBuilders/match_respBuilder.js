export default function requestsBuilder(sourceMatches) {
   const resultArray = sourceMatches.reduce((acc, match) => {
      const matchId_Index = acc.findIndex((item) => item.matchId === match.id)

      if (matchId_Index === -1) {
         acc.push({
            matchId: match.id,
            author: match.author,
            is_important: match.is_important,
            date: match.date,
            fPlayerId: match.author,
            fPlayerName: match.name,
            
            games: [
               {
                  game: 1,
                  winner: match.fp_score > match.sp_score ? 'fp' : 'sp',
                  fPlayerScore: match.fp_score,
                  sPlayerScore: match.sp_score
               }
            ]
         })

      } else {

         acc[matchId_Index].sPlayerId = match.player_id
         acc[matchId_Index].sPlayerName = match.name

         if (match.author === match.player_id) {
            acc[matchId_Index].games.push(
               {
                  game: acc[matchId_Index].games.length + 1,
                  winner: match.fp_score > match.sp_score ? 'fp' : 'sp',
                  fPlayerScore: match.fp_score,
                  sPlayerScore: match.sp_score
               }
            )
         }

      }
      return acc
   }, [])
   return resultArray
}
