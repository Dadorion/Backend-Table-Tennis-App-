import * as dotenv from 'dotenv'
dotenv.config()

const config = {
   secret: process.env.JWT_SECRET_KEY
}

export default config
