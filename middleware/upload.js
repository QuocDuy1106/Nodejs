import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Thiết lập multer để lưu vào thư mục tạm thời
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Sử dụng một thư mục tạm thời như './tmp'
    const tempPath = './uploads';
    
    cb(null, tempPath); // Upload file vào thư mục tạm thời
  },
  filename: (req, file, cb) => {
    // Giữ tên file gốc
    cb(null, file.originalname);
  }
});

// Thiết lập upload file với giới hạn dung lượng
const upload = multer({
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 } // Giới hạn kích thước file là 10MB
}).single('hinhanh');

const isAuth = (req, res, next) => {
  if (req.session.isAuth && req.session.user.role === 'admin') {
      next();
  } else {
      res.redirect("/login");
  }
}

export default {upload, isAuth}
