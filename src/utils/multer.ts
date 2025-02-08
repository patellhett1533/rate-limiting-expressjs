import multer from "multer";
import ShortUniqueId from "short-unique-id";

const uuid = new ShortUniqueId({ length: 10 });

const storage = multer.diskStorage({
  destination: "./uploads/",
  filename: function (req, file, cb) {
    cb(null, uuid.rnd() + "-" + file.originalname);
  },
});
const upload = multer({ storage: storage });

export default upload;
