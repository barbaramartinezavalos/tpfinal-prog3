import bcryptjs from "bcryptjs" 
import { conexion } from './conexion.js';

export default class Usuarios {
    obtenerTodos = async (idUsuarioTipo) => {
        try {
            let sql = `SELECT idUsuario, CONCAT(nombre, ' ', apellido) AS 'nombre completo', correoElectronico 
            FROM usuarios 
            WHERE activo = 1 `;
            if (idUsuarioTipo === 2)
                sql += `AND idUsuarioTipo = ?`
            const [resultado] = await conexion.query(sql, [idUsuarioTipo]);
            return resultado;
        } catch (error) {
            console.error('Error en obtenerTodos:', error);
            return { 
                estado: 500, 
                mensaje: `Error en el servidor ${error}` 
            };
        }
    }
    
    obtenerPorId = async (idUsuario, idUsuarioTipo) => {
        try {
            let sql = `SELECT u.idUsuario, CONCAT(u.nombre, ' ', u.apellido) as usuario, u.idUsuarioTipo, u.correoElectronico 
            FROM usuarios AS u 
            WHERE u.idUsuario = ? AND activo = 1 `;
            if (idUsuarioTipo)
                sql += `AND u.idUsuarioTipo = ?`
            const [resultado] = await conexion.query(sql, [idUsuario, idUsuarioTipo]);

            if (resultado.length === 0) {
                return null;
            }

            return resultado[0];
        } catch (error) {
            console.error('Error en obtenerPorId:', error);
            return { 
                estado: 500, 
                mensaje: `Error en el servidor ${error}` 
            };
        }
    }

    agregar = async (datos) => {
        try {
            const sql = `INSERT INTO usuarios (nombre, apellido, correoElectronico, contrasenia, idUsuarioTipo, activo) 
                        VALUES (?,?,?,?,?,1);`;
            const [resultado] = await conexion.query(sql, [datos.nombre, datos.apellido, datos.correoElectronico, datos.contrasenia, datos.idUsuarioTipo]);

            if (resultado.affectedRows === 0) {
                return { 
                    estado: 500, 
                    mensaje: 'No se pudo agregar el usuario' 
                };
            } 

            return `Se agregó correctamente el usuario ${resultado.insertId}`;
        } catch (error) {
            console.error('Error en agregar:', error);
            return { 
                estado: 500, 
                mensaje: `Error en el servidor ${error}` 
            };
        }
    }

    modificar = async (idUsuario, datos) => {
        try {
            const sql = `UPDATE usuarios SET ? WHERE idUsuario = ?`;
            const [resultado] = await conexion.query(sql, [datos, idUsuario]);

            if (resultado.affectedRows === 0) {
                return { 
                    estado: 500, 
                    mensaje: 'No se pudo modificar el usuario' 
                };
            }

            return `Se modificó correctamente el usuario ${idUsuario}`;
        } catch (error) {
            console.error('Error en modificar:', error);
            return { 
                estado: 500, 
                mensaje: `Error en el servidor ${error}` 
            };
        }
    };
    
    obtenerPorEmail = async (email) => {
        try {
            const sql = `SELECT * FROM usuarios WHERE correoElectronico = ?;`;
            const [resultado] = await conexion.query(sql, [email]);

            if (resultado.length === 0) {
                return null;
            }

            return resultado[0];
        } catch (error) {
            console.error('Error en obtenerPorEmail:', error);
            return { 
                estado: 500, 
                mensaje: `Error en el servidor ${error}` 
            };
        }
    };
}
