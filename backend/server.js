import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan'
import cors from 'cors'
import dotenv from 'dotenv'
import productRoutes from './routes/productRoutes.js'
import { sql } from './config/db.js';

dotenv.config()
          
const app =express();
const PORT=process.env.PORT || 3000;

app.use(express.json())
app.use(cors());
app.use(helmet()); // Security middleware ->protcts app by setting various http headers
app.use(morgan("dev")); //logs the requests

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