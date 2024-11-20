import express from 'express'
import ReclamosController from '../../controllers/reclamosController.js'
import passport from "../../middlewares/passport.js"
import { autorizarUsuarios } from '../../middlewares/methods.js'

const reclamosController = new ReclamosController()
const router = express.Router()

// Obtener todos los reclamos
router.get('/', passport.authenticate("jwt", { session: false }), reclamosController.obtenerTodos)

// Obtener el informe de los reclamos
router.get('/informe', passport.authenticate("jwt", { session: false }), autorizarUsuarios([1]), reclamosController.informe)

// Obtener un reclamo por id
router.get('/:idReclamo', passport.authenticate("jwt", { session: false }), reclamosController.obtenerPorId)

// Agregar un reclamo 
router.post('/', passport.authenticate("jwt", { session: false }), autorizarUsuarios([3]), reclamosController.agregar)

// Atender un reclamo 
router.post('/atencion/:idReclamo', passport.authenticate("jwt", { session: false }), autorizarUsuarios([2]), reclamosController.atenderReclamo)

// Cancelar un reclamo 
router.post('/cancelacion/:idReclamo', passport.authenticate("jwt", { session: false }), autorizarUsuarios([3]), reclamosController.cancelarReclamo)

export { router }