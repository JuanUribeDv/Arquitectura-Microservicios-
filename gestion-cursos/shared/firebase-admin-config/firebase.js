import { createRequire } from "module";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const require = createRequire(join(process.cwd(), "package.json"));
const admin = require("firebase-admin");
const { getFirestore, FieldValue } = require("firebase-admin/firestore");
const { getAuth } = require("firebase-admin/auth");

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const serviceAccount = JSON.parse(
  readFileSync(join(__dirname, "serviceAccountKey.json"), "utf8")
);

if (!admin.getApps().length) {
  admin.initializeApp({
    credential: admin.cert(serviceAccount),
  });
}

export const db = getFirestore();
export const auth = getAuth();
export { FieldValue };
export default admin;