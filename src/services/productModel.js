import connectDB from "../configs/connectDB.js";

// Lấy tất cả sản phẩm
const getAllProduct = async () => {
    const [rows, fields] = await connectDB.execute('SELECT * FROM `sanpham`');
    return rows;
};

// Lấy tất cả nhóm sản phẩm
const getAllNhom = async () => {
    const [rows, fields] = await connectDB.execute('SELECT idnhom, ten AS tenNhom FROM `nhom`');
    return rows;
};

// Thêm sản phẩm vào cơ sở dữ liệu
const insertProduct = async (ten, gia, hinhanh, mota, idnhom) => {
    await connectDB.execute("INSERT INTO `sanpham` (ten, gia, hinhanh, mota, idnhom) VALUES (?, ?, ?, ?, ?)", [ten, gia, hinhanh, mota, idnhom]);
};

const detailProduct = async (id) => {
    const [rows] = await connectDB.execute(`
        SELECT sanpham.ten AS tenSP, sanpham.gia, sanpham.hinhanh, sanpham.mota, sanpham.idnhom, sanpham.masp, nhom.ten AS tenNhom 
        FROM sanpham 
        JOIN nhom ON sanpham.idnhom = nhom.idnhom 
        WHERE sanpham.masp = ?
    `, [id]);
    return rows[0];
};

// Cập nhật thông tin sản phẩm
const updateProduct = async (id, ten, gia, hinhanh, mota, idnhom) => {
    // Nếu hinhanh là null và không được cập nhật, bạn không cần phải thay đổi nó
    if (!hinhanh) {
        await connectDB.execute(
            `UPDATE sanpham SET ten = ?, gia = ?, mota = ?, idnhom = ? WHERE masp = ?`,
            [ten, gia, mota, idnhom, id]
        );
    } else {
        await connectDB.execute(
            `UPDATE sanpham SET ten = ?, gia = ?, hinhanh = ?, mota = ?, idnhom = ? WHERE masp = ?`,
            [ten, gia, hinhanh, mota, idnhom, id]
        );
    }
};

const deleteProduct = async(masp) => {
    await connectDB.execute("DELETE FROM `sanpham` WHERE masp=?", [masp])
}

// Lấy sản phẩm theo nhóm
const getProductsByGroup = async (idnhom) => {
    const [rows, fields] = await connectDB.execute(`
        SELECT * FROM sanpham WHERE idnhom = ?
    `, [idnhom]);
    return rows;
};
export default { getAllProduct, insertProduct, getAllNhom, detailProduct, updateProduct, deleteProduct, getProductsByGroup };
