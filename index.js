import express from 'express'
import router from './routers/mainRourer.js'

const PORT = 5000

const app = express()
app.use(express.json())

app.use('/api', router)
app.get('/', (req, res) => { res.json('hello') })

async function startApp() {
   try { app.listen(PORT, () => { console.log('SERVER WORK ON PORT ' + PORT) }) }
   catch (e) { console.log(e) }
}

startApp()