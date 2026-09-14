// shared/firebase-admin-config/firebase.js
import admin from "firebase-admin";
import { getFirestore } from "firebase-admin/firestore";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

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
export default admin;