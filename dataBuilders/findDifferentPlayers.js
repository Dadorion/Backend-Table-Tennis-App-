const arrOne = ['Саша', 'Маша', 'Вася', 'Макс', 'ФФ', 'Катя', 'Сергей']
const arrTwo = ['Маша', 'Петр', 'Саша', 'Макс', 'ФФ', 'Катя', 'Сергей']

export default function findDifferentPlayers(arrBig, arrSmal) {
   let difаerentPlayers = []
   for (const player of arrSmal) {
      if (!arrBig.includes(player)) {
         difаerentPlayers.push(player)
      }
   }
   for (const player of arrBig) {
      if (!arrSmal.includes(player) && !difаerentPlayers.includes(player)) {
         difаerentPlayers.push(player)
      }
   }
   return difаerentPlayers
}

const difаerentPlayers = findDifferentPlayers(arrOne, arrTwo)

console.log(difаerentPlayers)
