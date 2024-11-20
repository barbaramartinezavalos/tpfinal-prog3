import { conexion } from "./conexion.js";

export default class UsuariosOficinas {
    
    obtenerPorIdUsuarioOficina = async (idUsuarioOficina) => {
        try {
            const sql = `SELECT * FROM usuarios_oficinas WHERE idUsuarioOficina = ?;`;
            const [resultado] = await conexion.query(sql, [idUsuarioOficina]);

            if (resultado.length === 0) {
                return null;
            }

            return resultado[0];
        } catch (error) {
            console.error('Error en obtenerPorIdUsuarioOficina:', error);
            return { 
                estado: 500, 
                mensaje: `Error en el servidor ${error}` 
            };
        }
    };

    obtenerPorIdUsuario = async (idUsuario) => {
        try {
            let sql = `SELECT * FROM usuarios_oficinas WHERE idUsuario = ?;`;

            const [resultado] = await conexion.query(sql, [idUsuario]);

            if (resultado.length === 0) {
                return null;
            }

            return resultado[0];
        } catch (error) {
            console.error('Error en obtenerPorIdUsuario:', error);
            return { 
                estado: 500, 
                mensaje: `Error en el servidor ${error}` 
            };
        }
    };

    obtenerPorIdOficina = async (idOficina) => {
        try {
            const sql = `SELECT * FROM usuarios_oficinas WHERE idOficina = ?;`;
            const [resultado] = await conexion.query(sql, [idOficina]);

            if (resultado.length === 0) {
                return null;
            }

            return resultado;
        } catch (error) {
            console.error('Error en obtenerPorIdOficina:', error);
            return { 
                estado: 500, 
                mensaje: `Error en el servidor ${error}` 
            };
        }
    };

    agregarEmpleados = async (listaEmpleadosAgregar, listaEmpleadosModificar, idOficina) => {
        let empleados = [];
        try {
            conexion.beginTransaction()

            if (listaEmpleadosAgregar) {
                for (const idEmpleadoA of listaEmpleadosAgregar) {
                    await conexion.query(`INSERT INTO usuarios_oficinas (idUsuario, idOficina, activo) VALUES (?, ?, 1);`, [idEmpleadoA, idOficina]);
                    empleados.push(idEmpleadoA);
                }
            }

            if (listaEmpleadosModificar) {
                for (const idEmpleadoM of listaEmpleadosModificar) {
                    await conexion.query(`UPDATE usuarios_oficinas SET idOficina = ?, activo = 1 WHERE idUsuario = ?;`, [idOficina, idEmpleadoM]);
                    empleados.push(idEmpleadoM);
                }
            }

            conexion.commit()

            return { mensaje: `Se agregaron correctamente los empleados: ${empleados.join(', ')}` }; 
        } catch (error) {
            conexion.rollback()

            console.error('Error en agregarEmpleados:', error);
            return { 
                estado: 500, 
                mensaje: `Error en el servidor ${error}` 
            };
        };
    };

    quitarEmpleados = async (idOficina, listaIdEmpleados) => {
        let empleados = [];
        try {
            conexion.beginTransaction()

            for (const idEmpleado of listaIdEmpleados) {
                await conexion.query(`UPDATE usuarios_oficinas SET activo = 0 WHERE idOficina = ? AND idUsuario = ?;`, [idOficina, idEmpleado]);
                empleados.push(idEmpleado);
            }

            conexion.commit()

            return { mensaje: `Se quitaron correctamente los empleados: ${empleados.join(', ')}` }; 
        } catch (error) {
            conexion.rollback()
            
            console.error('Error en quitarEmpleados:', error);
            return { 
                estado: 500, 
                mensaje: `Error en el servidor ${error}` 
            };
        };
    }

    obtenerEstadisticas = async () => {
        try {
            const sql = `SELECT o.nombre, COUNT(*) AS cantidadU 
                        FROM usuarios_oficinas AS uo 
                        INNER JOIN oficinas AS o ON uo.idOficina = o.idOficina 
                        GROUP BY uo.idOficina ORDER BY cantidadU DESC;`;
            const resultado = await conexion.query(sql);

            const cantidad = resultado[0].length
            const detalle = resultado[0]
            return {cantidad, detalle}
        } catch (error) {
            return { 
                estado: 500, 
                mensaje: `Error en el servidor ${error}` 
            };
        }
    }
}