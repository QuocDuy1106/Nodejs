import express from "express";
import productModel from "../services/productModel.js";
import upload from "../../middleware/upload.js"; 
import { formatPrice } from "../utils/utils.js";
// Lấy tất cả sản phẩm
const getAllProduct = async (req, res) => {
    try {
        const products = await productModel.getAllProduct();
        if (products && products.length > 0) {
            // Định dạng giá cho từng sản phẩm trong mảng
            products.forEach(product => {
                product.gia = formatPrice(product.gia);
            });
        }
        res.render('home', { 
            data: { 
                title: 'Sản phẩm', 
                page: 'product', 
                products: products 
            } 
        });
    } catch (error) {
        console.error('Lỗi khi lấy sản phẩm:', error);
        res.status(500).send('Lỗi server');
    }
};

const getAllProducts = async (req, res) => {
    try {
        const products = await productModel.getAllProduct();
        res.json(products);  // Trả về dữ liệu dưới dạng mảng JSON
    } catch (error) {
        console.error('Lỗi khi lấy sản phẩm:', error);
        res.status(500).send('Lỗi server');
    }
};

// Lấy danh sách nhóm sản phẩm và render trang thêm sản phẩm
const insertProduct = async (req, res) => {
    try {
        const nhom = await productModel.getAllNhom(); // Lấy danh sách nhóm sản phẩm
        res.render('home', { 
            data: { 
                title: 'Thêm sản phẩm', 
                page: 'addProduct',
                nhom: nhom // Truyền danh sách nhóm sản phẩm vào view
            } 
        });
    } catch (error) {
        console.error('Lỗi khi lấy nhóm sản phẩm:', error);
        res.status(500).send('Lỗi server');
    }
};

const addProduct = (req, res) => {
    upload.upload(req, res, async (err) => {  // Đảm bảo sử dụng đúng `upload`
        if (err) {
            console.error('Lỗi khi upload file:', err);
            return res.status(500).send('Lỗi khi tải lên hình ảnh');
        }

        const { ten, gia, mota, idnhom } = req.body;
        const hinhanh = req.file ? req.file.filename : null;  // Kiểm tra nếu có file hình ảnh

        if (!ten || !gia || !mota || !idnhom) {
            return res.status(400).send('Vui lòng điền đầy đủ thông tin sản phẩm.');
        }

        try {
            await productModel.insertProduct(ten, gia, hinhanh, mota, idnhom);
            res.redirect('/list-product');  // Sau khi thêm, chuyển hướng đến danh sách sản phẩm
        } catch (error) {
            console.error('Lỗi khi thêm sản phẩm:', error);
            res.status(500).send('Lỗi server khi thêm sản phẩm');
        }
    });
};

const detailProduct = async (req, res) => {
    try {
        let id = req.params.id;
        let dataProduct = await productModel.detailProduct(id);

        if (dataProduct) {
            // Định dạng giá trước khi truyền dữ liệu đến view
            dataProduct.gia = formatPrice(dataProduct.gia);
        }

        res.render('home', { 
            data: { 
                title: 'Detail Product', 
                page: 'detailProduct', 
                product: dataProduct 
            } 
        });
    } catch (err) {
        console.error('Error fetching product details:', err);
        res.status(500).send('Lỗi khi lấy chi tiết sản phẩm.');
    }
};

// Đảm bảo rằng API trả về chi tiết sản phẩm đúng với ID
const detailProducts = async (req, res) => {
    let id = req.params.id;
    try {
        let dataProduct = await productModel.detailProduct(id);
        res.json(dataProduct);  // Trả dữ liệu sản phẩm dưới dạng JSON
    } catch (error) {
        console.error('Lỗi khi lấy chi tiết sản phẩm:', error);
        res.status(500).send('Lỗi server khi lấy chi tiết sản phẩm');
    }
};

// Lấy thông tin sản phẩm và render trang cập nhật sản phẩm
const editProduct = async (req, res) => {
    let id = req.params.id;
    try {
        let product = await productModel.detailProduct(id);
        let nhom = await productModel.getAllNhom(); // Lấy tất cả nhóm sản phẩm để chọn
        res.render('home', {
            data: {
                title: 'Chỉnh Sửa Sản Phẩm',
                page: 'editProduct',
                product: product,
                nhom: nhom // Truyền danh sách nhóm vào view
            }
        });
    } catch (error) {
        console.error('Lỗi khi lấy thông tin sản phẩm:', error);
        res.status(500).send('Lỗi server');
    }
};

// Cập nhật thông tin sản phẩm
const updateProduct = async (req, res) => {
    upload.upload(req, res, async (err) => {
        if (err) {
            console.error('Lỗi khi upload file:', err);
            return res.status(500).send('Lỗi khi tải lên hình ảnh');
        }

        let id = req.params.id;
        const { ten, gia, mota, idnhom } = req.body;
        const hinhanh = req.file ? req.file.filename : null;  // Kiểm tra nếu có file hình ảnh

        if (!ten || !gia || !mota || !idnhom) {
            return res.status(400).send('Vui lòng điền đầy đủ thông tin sản phẩm.');
        }

        try {
            await productModel.updateProduct(id, ten, gia, hinhanh, mota, idnhom);
            res.redirect(`/detail-product/${id}`);  // Sau khi cập nhật, chuyển hướng về trang chi tiết sản phẩm
        } catch (error) {
            console.error('Lỗi khi cập nhật sản phẩm:', error);
            res.status(500).send('Lỗi server khi cập nhật sản phẩm');
        }
    });
};

const deleteProduct = async (req, res) => {
    let { masp } = req.body;  // Lấy mã sản phẩm từ body
    if (!masp) {
        return res.status(400).send('Mã sản phẩm không hợp lệ');
    }

    try {
        await productModel.deleteProduct(masp);  // Xóa sản phẩm
        res.redirect('/list-product');  // Chuyển hướng về danh sách sản phẩm
    } catch (error) {
        console.error('Lỗi khi xóa sản phẩm:', error);
        res.status(500).send('Lỗi server khi xóa sản phẩm');
    }
};

// Thêm phương thức lấy tất cả nhóm sản phẩm
const getAllNhom = async (req, res) => {
    try {
        const nhom = await productModel.getAllNhom(); // Lấy danh sách nhóm sản phẩm từ model
        res.json(nhom);  // Trả về danh sách nhóm sản phẩm dưới dạng JSON
    } catch (error) {
        console.error('Lỗi khi lấy nhóm sản phẩm:', error);
        res.status(500).send('Lỗi server khi lấy nhóm sản phẩm');
    }
};
// Tìm sản phẩm theo nhóm
const getProductsByGroup = async (req, res) => {
    const { idnhom } = req.params;
    try {
        const products = await productModel.getProductsByGroup(idnhom); // Lấy sản phẩm theo id nhóm
        res.json(products);  // Trả về danh sách sản phẩm theo nhóm
    } catch (error) {
        console.error('Lỗi khi tìm sản phẩm theo nhóm:', error);
        res.status(500).send('Lỗi server khi tìm sản phẩm theo nhóm');
    }
};
export default { getAllProduct, insertProduct, addProduct, detailProduct, editProduct, updateProduct, deleteProduct, getAllProducts, detailProducts, getAllNhom, getProductsByGroup};
