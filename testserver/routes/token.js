const express = require("express");
const router = express.Router();
const rateLimit = require("express-rate-limit");
const users = require("../data/usersData");
const { authenticateToken } = require("../authMiddleware");

// Rate limiter para proteger el endpoint de verificación de token contra ataques de fuerza bruta o DoS.
const verifyLimiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutos
	max: 100, // Limita cada IP a 100 peticiones por ventana de tiempo
	standardHeaders: true, // Devuelve la información del rate limit en las cabeceras `RateLimit-*`
	legacyHeaders: false, // Deshabilita las cabeceras `X-RateLimit-*`
	message:
		"Demasiadas peticiones desde esta IP, por favor intente de nuevo después de 15 minutos.",
});

/**
 * @fileoverview Rutas para la gestión de tokens de autenticación.
 * Proporciona un endpoint para verificar la validez de un token y obtener los datos del usuario asociado.
 */

/**
 * GET /token/verify
 * Verifica el token proporcionado en la cabecera y retorna los datos del usuario.
 * Utiliza el middleware `authenticateToken` para validar el token antes de procesar la solicitud.
 */
router.get("/verify", verifyLimiter, authenticateToken, (req, res) => {
	// Si el middleware 'authenticateToken' pasa, el token es válido.
	// El correo del usuario ya está en req.tokenEmail.
	const userMail = req.tokenEmail;
	const user = users.find(
		(u) => u.mail.toLowerCase() === userMail.toLowerCase()
	);

	if (!user) {
		return res
			.status(404)
			.json({ message: "Usuario asociado al token no encontrado." });
	}

	const { password, ...userResponse } = user;
	res.status(200).json({ user: userResponse, token: req.token });
});

module.exports = router;
