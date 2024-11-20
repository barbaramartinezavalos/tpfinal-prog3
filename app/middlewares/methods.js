export const autorizarUsuarios = ( autorizados = [] ) => {
    return (req, res, next) => {
        const usuario = req.user;
        if( !usuario || !autorizados.includes(usuario.idUsuarioTipo) ) {
            return res.status(403).json({
                estado: 403,
                mesaje: "Acceso denegado"
            });
        };
    
        next();
    }
}
