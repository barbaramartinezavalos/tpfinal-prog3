import passport from 'passport';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import Usuarios from '../database/usuario.js';
import dotenv from 'dotenv';
dotenv.config();

const opts = {
	jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
	secretOrKey: process.env.JWT_SECRET
};

passport.use(new JwtStrategy(opts, async (jwt_payload, done) => {
	try {
		const user = new Usuarios()
		const usuario = await user.obtenerPorId(jwt_payload.id);
		if (usuario) {
			return done(null, usuario);
		} else {
			return done(null, false);
		}
	} catch (error) {
		return done(error, false);
	}
}));

export default passport;
