import express from "express"
import templateRoute from './api/template'
import chatRoute from './api/chat'
import cors from "cors"

const app = express()

app.use(cors())
app.use('/api/template', templateRoute)
app.use('/api/chat', chatRoute)

app.listen(3000)