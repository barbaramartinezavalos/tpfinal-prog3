import express from 'express'
import UsuariosController from '../../controllers/usuariosController.js'
import passport from "../../middlewares/passport.js"

const usuariosController = new UsuariosController()
const router = express.Router()

// Registro
router.post('/registro', usuariosController.registrar)

// Actualizar perfil de usuario
router.patch('/actualizar-perfil', passport.authenticate("jwt", { session: false }), usuariosController.actualizarPerfil)

export { router }