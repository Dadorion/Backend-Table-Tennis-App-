export default function requestsBuilder(sourceMatches) {
   const resultArray = sourceMatches.reduce((acc, match) => {
      const matchId_Index = acc.findIndex((item) => item.matchId === match.m_id)

      if (matchId_Index === -1) {
         acc.push({
            matchId: match.m_id,
            date: match.date,
            city: match.city,
            location: match.loc,
            fPlayerID: match.fp_id,
            sPlayerID: match.sp_id,
            fPlayerName: match.author_name,
            fPlayerSurname: match.author_surname,
            sPlayerName: match.player_name,
            sPlayerSurname: match.player_surname,
            is_important: match.is_important,

            games: [{
               game: 1,
               gameId: match.g_id,
               winner: match.fp_score > match.sp_score ? 'fp' : 'sp',
               fPlayerScore: match.fp_score,
               sPlayerScore: match.sp_score
            }]
         })

      } else {
         acc[matchId_Index].games.push({
            game: acc[matchId_Index].games.length + 1,
            gameId: match.g_id,
            winner: match.fp_score > match.sp_score ? 'fp' : 'sp',
            fPlayerScore: match.fp_score,
            sPlayerScore: match.sp_score
         })
      }
      return acc
   }, [])
   return resultArray
}
