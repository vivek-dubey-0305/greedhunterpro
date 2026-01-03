import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

//* local storage m rakhne k liye
const storage = multer.diskStorage({

    destination: function (req, file, cb) {
        console.log("\n-----------\nMULTER.js\n-----------\n");
        // Use absolute path from project root
        const uploadPath = path.join(__dirname, "..", "public", "temp");
        cb(null, uploadPath)
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, file.fieldname + '-' + uniqueSuffix)
    }
})
// * multer upload
export const upload = multer({
    storage,
})