import express from "express";
import bcrypt from "bcrypt";
import userModel from "../services/userModel.js";
import JWTAction from '../../middleware/jwt.js';
import jwt from 'jsonwebtoken';
const getAllUser = async (req, res) => {
    let userList = await userModel.getAllUser();
    res.render('home', { data: { title: 'List User', page: 'listUser', rows: userList } });
}
const createUser = (req, res) => {
    res.render('home', {data: {title: 'Create New User', page: 'insertUser'} })
}

// const insertUser = async (req, res) => {
//     let {username, password, fullname, address, sex, email} = req.body
//     if (!userModel.isUserExist(username)) {
//         await userModel.insertUser(username, password, fullname, address, sex, email)
//         res.redirect("/")
//     }
//     else
//         res.send("User exist")
// }

const insertUser = async (req, res) => {
    let { username, password, fullname, address, sex, email } = req.body;

    // Chờ kết quả của isUserExist
    const userExists = await userModel.isUserExist(username);

    if (!userExists) {
        try {
            // Gọi hàm insertUser để thêm người dùng vào cơ sở dữ liệu
            await userModel.insertUser(username, password, fullname, address, sex, email);
            res.redirect("/"); // Điều hướng về trang chủ sau khi thêm người dùng thành công
        } catch (error) {
            res.status(500).send("Error inserting user");
        }
    } else {
        res.send("User already exists");
    }
};

const detailUser = async (req, res) => {
    // if (isAuthentication(req, res) == true) {}
    let user = req.params.username
    let dataUser = await userModel.detailUser(user)
    res.render('home', {data: {title: 'Detail User', page: 'detailUser', rows: dataUser} })
}

const editUser = async (req, res) => {
    let user = req.params.username
    let dataUser = await userModel.detailUser(user)
    res.render('home', {data: {title: 'Edit User', page: 'editUser', rows: dataUser} })
}

const updateUser = async (req, res) => {
    console.log(req.body);
    const { username } = req.params; // Lấy username từ URL
    const { password, fullname, address, sex, email } = req.body;
    await userModel.updateUser(username, password, fullname, address, sex, email);
    res.redirect("/list-user");
}

const deleteUser = async (req, res) => {
    let {username} = req.body
    await userModel.deleteUser(username)
    res.redirect("/list-user")
}

//Client
const getUserDetail = async (req, res) => {
    try {
        const { userid } = req.params;
        const user = await userModel.getUserById(userid);

        if (!user) {
            return res.status(404).json({ message: "Không tìm thấy người dùng." });
        }

        res.status(200).json({ user });
    } catch (error) {
        console.error("Lỗi khi lấy thông tin người dùng:", error);
        res.status(500).json({ message: "Lỗi server." });
    }
};

const updateUserDetail = async (req, res) => {
    try {
        const { userid } = req.params;
        const { fullname, email, sex, address } = req.body;

        const result = await userModel.updateUserDetail(userid, fullname, email, sex, address);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Người dùng không tồn tại." });
        }

        res.status(200).json({ message: "Cập nhật thông tin thành công." });
    } catch (error) {
        console.error("Lỗi khi cập nhật thông tin người dùng:", error);
        res.status(500).json({ message: "Lỗi server." });
    }
};
// Client
const insertAdmin = async (req, res) => {
    try {
        const { username, password, fullname, address, sex, email, role } = req.body;
        const acc = await userModel.getUserByUsername(username);
        
        if (acc) {
            return res.status(400).json({ message: 'Username already exists' });
        }

        // Băm mật khẩu
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Chèn vào cơ sở dữ liệu
        await userModel.insertAdmin(null, username, hashedPassword, fullname, address, sex, email, role);

        res.status(200).json({ message: 'Created successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const loginUser = async (req, res) => {
    try {
        const { username, password } = req.body;

        // Lấy thông tin người dùng từ cơ sở dữ liệu
        const acc = await userModel.getUserByUsername(username);

        if (!acc) {
            return res.status(400).json({ message: 'Username không tồn tại' });
        }

        // Kiểm tra xem mật khẩu có hợp lệ không
        const isPasswordMatch = await bcrypt.compare(password, acc.password);

        console.log("Password from request:", password);
        console.log("Hashed password from DB:", acc.password);
        console.log(isPasswordMatch)

        if (!isPasswordMatch) {
            return res.status(401).json({ message: 'Mật khẩu không đúng' });
        }

        const payload = {
            username: acc.username,
            role: acc.role,
        };

        const token = JWTAction.createJWT(payload);
        console.log(token)
        // Set cookie JWT
        res.cookie("jwt", token, { path: "/", httpOnly: true, secure: false, sameSite: 'Lax' });
        req.session.isAuth = true;
        // Lưu thông tin vào session để sử dụng trong các phần khác
        req.session.user = acc;  // Lưu thông tin user vào session
        // Trả về thông báo đăng nhập thành công
        return res.status(200).json({ message: 'Đăng nhập thành công', token, user: acc });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Lỗi xảy ra bên server' });
    }
};

const loginAdmin = async (req, res) => {
    res.render('login', { data: { title: 'Login' } });
}

const getAdmin = async (req, res) => {
    let { username, password } = req.body;
    
    const acc = await userModel.getUserByUsername(username);
    // console.log(acc);
    if (!acc) {
        return res.redirect('/login');
    }

    const isPasswordValid = await bcrypt.compare(password, acc.password);
    if (!isPasswordValid) {
        return res.redirect('/');
    }

    req.session.isAuth = true;
    req.session.user = acc;
    // console.log(req.session);
    return res.redirect('/');
}

const logout = (req, res) => {
    res.clearCookie('jwt'); // Xóa cookie JWT
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({ message: 'Error logging out' });
        }
        res.clearCookie('connect.sid');  // Xóa cookie session
        req.redirect("/login")
    });
};

const logoutAPI = (req, res) => {
    res.clearCookie('jwt');
    res.status(200).json({ message: 'Đăng xuất thành công'})
};


export default {getAllUser, createUser, detailUser, updateUser, editUser, insertUser, deleteUser, loginUser, loginAdmin, insertAdmin, logout, logoutAPI, getAdmin, getUserDetail, updateUserDetail}