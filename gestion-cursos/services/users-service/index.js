import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import admin, { auth, db, FieldValue } from "../../shared/firebase-admin-config/firebase.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 4001;
const validRoles = new Set(["admin", "docente", "estudiante"]);

app.use(cors());
app.use(express.json());

async function getAuthenticatedUser(req) {
	const authorization = req.headers.authorization || "";
	console.log(`[users] auth header=${Boolean(authorization)} bearer=${authorization.startsWith("Bearer ")}`);
	if (!authorization.startsWith("Bearer ")) return null;
	let decoded;
	try {
		decoded = await auth.verifyIdToken(authorization.slice(7));
	} catch (error) {
		console.error(`[users] verifyIdToken code=${error.code || "unknown"} message=${error.message}`);
		throw error;
	}
	const profile = await db.collection("users").doc(decoded.uid).get();
	return { uid: decoded.uid, email: decoded.email, role: profile.data()?.role || decoded.role };
}

async function requireAdmin(req, res, next) {
	try {
		const user = await getAuthenticatedUser(req);
		if (!user) return res.status(401).json({ message: "Token requerido" });
		if (user.role !== "admin") return res.status(403).json({ message: "Permisos insuficientes" });
		req.user = user;
		next();
	} catch (error) {
		res.status(401).json({ message: error.message });
	}
}

async function requireAuth(req, res, next) {

	try {
		const user = await getAuthenticatedUser(req);
		if (!user) return res.status(401).json({ message: "Token requerido" });
		req.user = user;
		next();
	} catch (error) {
		res.status(401).json({ message: error.message });
	}
}

app.get("/ping", (_req, res) => res.json({ ok: true, message: "Users Service funcionando" }));

app.get("/api/users/me", async (req, res) => {
	try {
		const user = await getAuthenticatedUser(req);
		if (!user) return res.status(401).json({ message: "Token requerido" });
		const profile = await db.collection("users").doc(user.uid).get();
		if (!profile.exists) {
			const newProfile = {
				uid: user.uid,
				email: user.email,
				displayName: "",
				role: "estudiante",
				createdAt: FieldValue.serverTimestamp(),
			};
			await db.collection("users").doc(user.uid).set(newProfile);
			await auth.setCustomUserClaims(user.uid, { role: "estudiante" });
			return res.json({ uid: user.uid, email: user.email, displayName: "", role: "estudiante" });
		}
		res.json({ ...user, ...profile.data() });
	} catch (error) {
		console.error("Error en /api/users/me:", error);
		res.status(error.code === "auth/id-token-expired" || error.code === "auth/argument-error" ? 401 : 500).json({ message: error.message });
	}
});

app.get("/api/users/students", requireAuth, async (_req, res) => {
	const snapshot = await db.collection("users").where("role", "==", "estudiante").get();
	res.json(snapshot.docs.map((doc) => ({ uid: doc.id, ...doc.data() })));
});

app.post("/api/users/profile", requireAuth, async (req, res) => {
	const { displayName = "", role: requestedRole = "estudiante" } = req.body;
	const role = process.env.ALLOW_PUBLIC_ROLE_ASSIGNMENT === "true" && validRoles.has(requestedRole) ? requestedRole : "estudiante";
	const profile = { uid: req.user.uid, email: req.user.email, displayName, role, updatedAt: FieldValue.serverTimestamp() };
	await db.collection("users").doc(req.user.uid).set(profile, { merge: true });
	await auth.setCustomUserClaims(req.user.uid, { role });
	res.status(201).json({ uid: req.user.uid, email: req.user.email, displayName, role });
});

app.get("/api/users", requireAdmin, async (_req, res) => {
	const authUsers = await auth.listUsers(1000);
	const users = await Promise.all(authUsers.users.map(async (authUser) => {
		const profile = await db.collection("users").doc(authUser.uid).get();
		return { uid: authUser.uid, email: authUser.email, displayName: authUser.displayName || "", role: profile.data()?.role || authUser.customClaims?.role || "estudiante" };
	}));
	res.json(users);
});

app.post("/api/users", requireAdmin, async (req, res) => {
	const { email, password, displayName = "", role } = req.body;
	if (!email || !password || !validRoles.has(role)) return res.status(400).json({ message: "Email, contraseña y rol válido son obligatorios" });
	try {
		const authUser = await auth.createUser({ email, password, displayName });
		await auth.setCustomUserClaims(authUser.uid, { role });
		await db.collection("users").doc(authUser.uid).set({ uid: authUser.uid, email, displayName, role, createdAt: FieldValue.serverTimestamp() });
		res.status(201).json({ uid: authUser.uid, email, displayName, role });
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
});

app.patch("/api/users/:uid/role", requireAdmin, async (req, res) => {
	const { role } = req.body;
	if (!validRoles.has(role)) return res.status(400).json({ message: "Rol inválido" });
	await auth.setCustomUserClaims(req.params.uid, { role });
	await db.collection("users").doc(req.params.uid).set({ role }, { merge: true });
	res.json({ uid: req.params.uid, role });
});

app.listen(port, () => console.log(`Users Service corriendo en http://localhost:${port}`));
