import express from 'express'
import { login, register, cliente, administrador, empleado } from '../urlPages/url.js'
import passport from "../../middlewares/passport.js"
import { autorizarUsuarios } from '../../middlewares/methods.js'

const router = express.Router()

router.get('/', (req, res) => {
    res.status(200).send(login)
})
router.get('/register', (req, res) => {
    res.status(200).send(register)
})
router.get('/cliente', (req, res) => {
    res.status(200).send(cliente)
})
router.get('/empleado', passport.authenticate("jwt", { session: false }), autorizarUsuarios([2]), (req, res) => {
    res.status(200).send(empleado)
})
router.get('/administrador', passport.authenticate("jwt", { session: false }), autorizarUsuarios([1]), (req, res) => {
    res.status(200).send(administrador)
})

export { router }