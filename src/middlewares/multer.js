const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, '/Users/ddongs/Desktop/Elice2-Back/src/uploads'); //배포 시 배포 폴더 절대경로로 바꿀 것.
  },
  filename: (req, file, cb) => {
    console.log(file);
    cb(null, `${Date.now()}${path.extname(file.originalname)}`);
  },
});

const upload = multer({ storage: storage });

module.exports = upload;
