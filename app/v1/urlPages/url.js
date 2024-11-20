import path from 'path';
import { fileURLToPath } from "url";
import fs from 'fs'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const login = fs.readFileSync(__dirname + '../../../pages/login.html', 'utf-8')
const register = fs.readFileSync(__dirname + '../../../pages/register.html', 'utf-8')
const cliente = fs.readFileSync(__dirname + '../../../pages/sections/cliente.html', 'utf-8')
const administrador = fs.readFileSync(__dirname + '../../../pages/sections/administrador.html', 'utf-8')
const empleado = fs.readFileSync(__dirname + '../../../pages/sections/empleado.html', 'utf-8')
const email = fs.readFileSync(__dirname + '../../../pages/handlebars/email.hbs', 'utf-8')

export {login, register, cliente, administrador, empleado, email}