import express from 'express'
import ReclamosTiposController from '../../controllers/reclamosTiposController.js'
import passport from "../../middlewares/passport.js"
import { autorizarUsuarios } from '../../middlewares/methods.js'

const reclamosTiposController = new ReclamosTiposController()
const router = express.Router()


// Obtener todos los tipos de reclamos
router.get('/', passport.authenticate("jwt", { session: false }), autorizarUsuarios([1]), reclamosTiposController.obtenerTodos)

// Obtener un tipo de reclamo por id
router.get('/:idReclamoTipo', passport.authenticate("jwt", { session: false }), autorizarUsuarios([1]), reclamosTiposController.obtenerPorId)

// Agregar un tipo de reclamo 
router.post('/', passport.authenticate("jwt", { session: false }), autorizarUsuarios([1]), reclamosTiposController.agregar)

// Modificar un tipo de reclamo
router.patch('/:idReclamoTipo', passport.authenticate("jwt", { session: false }), autorizarUsuarios([1]), reclamosTiposController.modificar)

export { router }