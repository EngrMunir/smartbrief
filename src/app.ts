import cors from 'cors'
import express, { Application, Request, Response } from 'express'
import router from './app/routes'

const app:Application = express()

// parsers
app.use(express.json())

app.use(
    cors({
         origin: ['https://smartbrief-frontend.vercel.app'],
        credentials: true 
    }))

// application routes
app.use('/api', router);


app.get('/',(req:Request, res:Response)=>{
    res.send('home page')
})

export default app;