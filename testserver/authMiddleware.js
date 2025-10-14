const jwt = require("jsonwebtoken");
const tokenBlocklist = require("./data/tokenBlocklist");

function authenticateToken(req, res, next) {
	const authHeader = req.headers["authorization"];
	const token = authHeader?.split(" ")[1]; // Formato: Bearer TOKEN

	if (token == null) {
		return res.sendStatus(401); // Unauthorized: No hay token
	}

	// --- INICIO DE LA LÓGICA AÑADIDA ---
	// 1. Comprobar si el token está en la lista de bloqueo
	if (tokenBlocklist.includes(token)) {
		return res
			.status(403)
			.json({ error: "Forbidden: Token has been invalidated." });
	}
	// --- FIN DE LA LÓGICA AÑADIDA ---

	jwt.verify(token, process.env.JWT_SECRET, (err, payload) => {
		if (err) {
			if (err.name === "TokenExpiredError") {
				return res
					.status(401)
					.json({ error: "Unauthorized: Token has expired." });
			}
			return res.status(403).json({ error: "Forbidden: Invalid token." });
		}

		// 2. Si el token es válido, adjuntar datos a la request para los siguientes middlewares
		req.tokenEmail = payload.mail;
		req.token = token; // Adjuntamos el token para que la ruta /logout pueda acceder a él
		next();
	});
}

module.exports = { authenticateToken };
