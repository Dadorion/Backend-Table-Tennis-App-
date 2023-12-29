import jwt from 'jsonwebtoken'
import config from './config.js'

const generateAccessToken = (userId, playerId) => {
   const payload = {
      userId,
      playerId
   }
   return jwt.sign(payload, config.secret, {
      expiresIn: "2400h"
   })
}

export default generateAccessToken
