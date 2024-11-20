import express from 'express'
import ReclamosEstadosController from '../../controllers/reclamosEstadosController.js'
import passport from "../../middlewares/passport.js"
import { autorizarUsuarios } from '../../middlewares/methods.js'

const reclamosEstadosController = new ReclamosEstadosController()
const router = express.Router()

// Obtener todos los estados de reclamos
router.get('/', passport.authenticate("jwt", { session: false }), autorizarUsuarios([1]), reclamosEstadosController.obtenerTodos)

// Obtener un estado de reclamo por id
router.get('/:idReclamoEstado', passport.authenticate("jwt", { session: false }), autorizarUsuarios([1]), reclamosEstadosController.obtenerPorId)

// Agregar un estado de reclamo 
router.post('/', passport.authenticate("jwt", { session: false }), autorizarUsuarios([1]), reclamosEstadosController.agregar)

// Modificar un estado de reclamo
router.patch('/:idReclamoEstado', passport.authenticate("jwt", { session: false }), autorizarUsuarios([1]), reclamosEstadosController.modificar)

export { router }