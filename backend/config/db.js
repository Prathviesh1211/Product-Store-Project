import { neon } from "@neondatabase/serverless";
import dotenv from 'dotenv'

dotenv.config();

const {PGHOST,PGDATABASE,PGUSER,PGPASSWORD}=process.env

export const sql=neon (
    `postgresql://${PGUSER}:${PGPASSWORD}@${PGHOST}/${PGDATABASE}?sslmode=require`
)
// postgresql://neondb_owner:npg_B7k9UbNvrjwO@ep-rough-sea-a5uup39c-pooler.us-east-2.aws.neon.tech/neondb?sslmode=require
