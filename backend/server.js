import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan'
import cors from 'cors'
import dotenv from 'dotenv'
import productRoutes from './routes/productRoutes.js'
import { sql } from './config/db.js';
import { aj } from './lib/arcjet.js';

dotenv.config()
          
const app =express();
const PORT=process.env.PORT || 3000;

app.use(express.json())
app.use(cors());
app.use(helmet()); // Security middleware ->protcts app by setting various http headers
app.use(morgan("dev")); //logs the requests

///apply arjcet ratelimit to all route
app.use(async(req,res,next)=>{
    try{
        const decision=await aj.protect(req,{requested:1})      //each req uses 1token

        if(decision.isDenied()){
            if(decision.reason.isRateLimit()){
                res.status(429).json({error:'Too many requests'})
            }else if(decision.reason.isBot()){
                res.status(403).json({error:'Bot access denied'})
            }else{
                res.status(403).json({error:'Forbidden'})
            }
            return;
        }

        // check for spoofed bots -->//HUman like bot
        if(decision.results.some((result)=>result.reason.isBot() && result.reason.isSpoofed())){
            res.status(403).json({error:'Spoofed Bot detected'})
            return
        }

        next();
    }catch(error){
        console.log('Arcjet error : ',error);
        next(error);
    }
})
app.use('/api/products',productRoutes)

async function initDB(){
    try{
        await sql `
            CREATE TABLE IF NOT EXISTS products (
                id SERIAL PRIMARY KEY,
                name VARCHAR(250) NOT NULL,
                image VARCHAR(250) NOT NULL,
                price DECIMAL(10,2) NOT NULL,
                description VARCHAR(300) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `;
        console.log("Database Initialized successfully")
    }catch(error){
        console.log('Error in initDB',error)
    }
}

initDB().then(()=>{
    app.listen(PORT,()=>{
        console.log("server istening on port :",PORT);
    })
})