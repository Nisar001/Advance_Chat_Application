import express from 'express'
import dotenv from 'dotenv'
import colors from 'colors'
import bodyParser from "body-parser"
import ConnectDB from './config/ConnectDB.js'
import cors from 'cors'
import UserRoutes from './routes/UserRoutes.js'

dotenv.config()

ConnectDB()

const app = express()
app.use(bodyParser.json())
app.use(cors())

app.use('/auth/v1', UserRoutes)

const PORT = process.env.PORT || 5000;

app.listen(PORT, ()=>{
   console.log(`Server Runinning on ${process.env.DEV_MODE} Mode on Port ${PORT}`.bgCyan.white)
})