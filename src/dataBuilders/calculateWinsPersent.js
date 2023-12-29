export function checkMatches(answerMatches) {
   const matches = answerMatches.reduce((acc, match) => {
      const index = acc.findIndex((item) => item.id === match.id)

      if (index === -1) {
         acc.push({
            id: match.id,
            player: { id: match.player_id, name: match.player },
            opponent: { id: match.opponent_id, name: match.opponent },
            games: [
               {
                  game: 1,
                  win:
                     match.author_id === match.player_id
                        ? match.fp_score > match.sp_score
                        : match.fp_score < match.sp_score,
                  score:
                     match.author_id === match.player_id
                        ? { fp: match.fp_score, sp: match.sp_score }
                        : { fp: match.sp_score, sp: match.fp_score },
               },
            ],
         })
      } else {
         acc[index].games.push({
            game: acc[index].games.at(-1).game + 1,
            win:
               match.author_id === match.player_id
                  ? match.fp_score > match.sp_score
                  : match.fp_score < match.sp_score,
            score: { fp: match.fp_score, sp: match.sp_score },
         })
      }
      return acc
   }, [])

   const matchesWithWinner = matches.map((match) => {
      const trueCount = match.games.filter((game) => game.win).length
      const falseCount = match.games.length - trueCount
      match.isWinner = trueCount > falseCount

      return match
   })

   return matchesWithWinner
}

export function winsPersent(matches) {
   const totalMatches = matches.length
   const totalWins = matches.filter((match) => match.isWinner).length
   const winPercentage = (totalWins / totalMatches) * 100
   return winPercentage
}