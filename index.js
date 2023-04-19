import express from 'express'
import router from './routers/mainRouter.js'

const PORT = process.env.PORT || 5000

const app = express()
app.use(express.json())

app.get('/', (req, res) => { res.json('Welcome to Server v2.') })
app.use('/api', router)

async function startApp() {
   try { app.listen(PORT, () => { console.log('SERVER WORK ON PORT ' + PORT) }) }
   catch (e) { console.log(e) }
}

startApp()