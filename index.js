import * as dotenv from 'dotenv'
dotenv.config()
import express from 'express'
import mainRouter from './routers/mainRouter.js'
import authRouter from './routers/authRouter.js'

const PORT = process.env.PORT || 5000

const app = express()
app.use(express.json())

app.get('/', (req, res) => { res.json('Welcome to Server v2.') })
app.use('/auth', authRouter)
app.use('/api', mainRouter)

async function startApp() {
   try { app.listen(PORT, () => { console.log('SERVER WORK ON PORT ' + PORT) }) }
   catch (e) { console.log(e) }
}

startApp()
