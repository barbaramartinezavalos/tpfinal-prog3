import mysql from 'mysql2/promise'
import dotenv from "dotenv";

dotenv.config() 

export const conexion = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: '',
    database: process.env.DB_NAME
})