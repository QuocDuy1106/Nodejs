import express from "express";
import getHomePage from '../controllers/HomeController.js';
import userController from '../controllers/UserController.js';
import productController from '../controllers/ProductController.js';
import mdw from "../../middleware/upload.js";
import auth from "../../middleware/jwt.js";
const router = express.Router()
const initWebRoute = (app) => {
    router.get('/', mdw.isAuth, getHomePage)

    router.get('/list-user',  mdw.isAuth,userController.getAllUser)

    router.get('/list-user/:username', userController.detailUser)

    router.get('/edit-user/:username', userController.editUser)

    // router.post('/edit-user/:username', userController.updateUser)

    router.post('/update-user/:username', userController.updateUser)

    router.post('/delete-user',  mdw.isAuth, userController.deleteUser)

    router.get('/create-new-user', userController.createUser)

    router.post('/insert-new-user', userController.insertUser)

    //Sản phẩm
    router.get('/list-product', productController.getAllProduct);  // Danh sách sản phẩm
    router.get('/add-product', productController.insertProduct);  // Trang thêm sản phẩm
    router.post('/add-product', productController.addProduct);  // Xử lý thêm sản phẩm
    router.get('/detail-product/:id', productController.detailProduct); //Xem chi tiết sản phẩm
    router.get('/edit-product/:id', productController.editProduct); // Trang chỉnh sửa sản phẩm
    router.post('/update-product/:id', productController.updateProduct); // Xử lý cập nhật sản phẩm

    //Đăng nhập, đăng xuất
    router.get('/login', userController.loginAdmin)
    router.post('/login', userController.getAdmin)
    router.get('/logout', userController.logout);
    router.post('/delete-product',  mdw.isAuth, productController.deleteProduct)
    // router.get('/logout', user.logout);

    // router.get('/login', userController.formLoginUser)

    // router.get('/logout', userController.logOut)

    // router.post('/verify-login', userController.loginUser)

    // router.get('/upload-file', userController.uploadFile)

    // router.post('/save-file', userController.saveFileUpload)
    
    // API
    router.post('/api/loginUser', userController.loginUser)
    router.post('/api/register',  userController.insertAdmin)
    router.post('/api/logout', auth.authMiddleware, userController.logout);
    router.get('/api/product', productController.getAllProducts);
    router.get('/api/detail-product/:id', productController.detailProducts);
    router.get('/api/detail-user/:userid', userController.getUserDetail);
    router.post('/api/detail-user/:userid/update', userController.updateUserDetail);
    // API lấy danh sách nhóm sản phẩm
    router.get('/api/product/groups', productController.getAllNhom);  // Trả về danh sách nhóm sản phẩm
    router.get('/api/product/group/:idnhom', productController.getProductsByGroup);  // Tìm sản phẩm theo nhóm

    return app.use('/', router)
}
export default initWebRoute