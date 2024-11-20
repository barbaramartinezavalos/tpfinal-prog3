import express from 'express'
import OficinasController from '../../controllers/oficinasController.js'
import passport from "../../middlewares/passport.js"
import { autorizarUsuarios } from '../../middlewares/methods.js'

const oficinasController = new OficinasController()
const router = express.Router()

// Obtener todas las oficinas
router.get('/', passport.authenticate("jwt", { session: false }), autorizarUsuarios([1]), oficinasController.obtenerTodos)

// Obtener informe de usuarios por oficina
router.get('/informe', passport.authenticate("jwt", { session: false }), autorizarUsuarios([1]), oficinasController.obtenerInforme)

// Obtener una oficina por id
router.get('/:idOficina', passport.authenticate("jwt", { session: false }), autorizarUsuarios([1]), oficinasController.obtenerPorId)

// Agregar una oficina
router.post('/', passport.authenticate("jwt", { session: false }), autorizarUsuarios([1]), oficinasController.agregar)

// Modificar una oficina
router.patch('/:idOficina', passport.authenticate("jwt", { session: false }), autorizarUsuarios([1]), oficinasController.modificar)

// Agregar empleados a una oficina
router.post('/agregar-empleados', passport.authenticate("jwt", { session: false }), autorizarUsuarios([1]), oficinasController.agregarEmpleados)

// Quitar empleados a una oficina
router.post('/quitar-empleados', passport.authenticate("jwt", { session: false }), autorizarUsuarios([1]), oficinasController.quitarEmpleados)

export { router }