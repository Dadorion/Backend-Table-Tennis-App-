import * as dotenv from 'dotenv'
dotenv.config()
import express from 'express'
import mainRouter from './routers/mainRouter.js'
import authRouter from './routers/authRouter.js'
import getPort from 'get-port'
import cors from 'cors'
// const isTest = true
const isTest = false

let PORT
if (isTest) { PORT = await getPort() }
else { PORT = process.env.PORT || 5000 }


const app = express()
app.use(express.json())
app.use(cors({
   origin: 'http://localhost:3000', // Замените на адрес вашего фронтенда
   credentials: true, // Если вы работаете с cookies или аутентификацией
}));

app.get('/', (req, res) => { res.json('Welcome to Server v2.') })
app.use('/auth', authRouter)
app.use('/api', mainRouter)

export default app

async function startApp() {
   try { app.listen(PORT, () => { console.log('SERVER WORK ON PORT ' + PORT) }) }
   catch (e) { console.log(e.message) }
}

startApp()
