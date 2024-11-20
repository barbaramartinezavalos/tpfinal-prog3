import express from 'express'
import EmpleadosController from '../../controllers/empleadosController.js'
import UsuariosController from '../../controllers/usuariosController.js'
import passport from "../../middlewares/passport.js"
import { autorizarUsuarios } from '../../middlewares/methods.js'

const empleadosController = new EmpleadosController()
const usuariosController = new UsuariosController()
const router = express.Router()

// Obtener todos los empleados
router.get('/', passport.authenticate("jwt", { session: false }), autorizarUsuarios([1]), empleadosController.obtenerTodos)

// Obtener un empleado por id
router.get('/:idUsuario', passport.authenticate("jwt", { session: false }), autorizarUsuarios([1]), empleadosController.obtenerPorId)

// Agregar un empleado 
router.post('/', passport.authenticate("jwt", { session: false }), autorizarUsuarios([1]), empleadosController.agregar)

// Modificar un empleado
router.patch('/:idUsuario', passport.authenticate("jwt", { session: false }), autorizarUsuarios([1]), usuariosController.actualizarPerfil)

export { router }