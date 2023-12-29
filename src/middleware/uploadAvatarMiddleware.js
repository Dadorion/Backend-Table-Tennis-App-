import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    // Генерируем уникальное имя для файла
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const types = ["image/png", "image/jpeg", "image/jpg", "image/png"];

function fileFilter(req, file, cb) {
  if (types.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(null, false);
  }
}

const upload = multer({ storage, fileFilter });

export default upload;
