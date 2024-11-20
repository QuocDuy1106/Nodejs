import connectDB from "../configs/connectDB.js";
import bcrypt from 'bcrypt';
const getAllUser = async () => {
    const [rows, fields] = await connectDB.execute('SELECT * FROM `users`')
    return rows
}
// const createNewUser = async (userData) => {
//     const { username, password, fullname, address, sex, email } = userData; // Lấy thông tin từ userData
//     const [rows] = await connectDB.execute(
//         'INSERT INTO users (username, password, fullname, address) VALUES (?, ?, ?, ?)',
//         [username, password, fullname, address, sex, email]
//     );
//     return rows; // Trả về kết quả của thao tác chèn
// }
const isUserExist = async (username) => {
    const [rows] = await connectDB.execute('SELECT * FROM users WHERE username = ?', [username]);
    return rows.length > 0; 
}
const saltRounds = 10; // Số vòng băm
const insertUser = async (username, password, fullname, address, sex, email) => {
    try {
        // Băm mật khẩu trước khi lưu vào cơ sở dữ liệu
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Chỉ định rõ các cột trong câu lệnh INSERT
        await connectDB.execute(
            "INSERT INTO users (username, password, fullname, address, sex, email) VALUES (?, ?, ?, ?, ?, ?)", 
            [username, hashedPassword, fullname, address, sex, email]
        );
    } catch (error) {
        console.error("Error inserting user:", error);
        throw error;
    }
};
const detailUser = async (user) => {
    const [rows, fields] = await connectDB.execute('SELECT * FROM `users` WHERE username=?', [user])
    return rows[0]
}
const updateUser = async (username, password, fullname, address, sex, email) => {
    await connectDB.execute('UPDATE users SET password=?, fullname=?, address=?, sex=?, email=? WHERE username=?',[password, fullname, address, sex, email, username])
}
const deleteUser = async(user) => {
    await connectDB.execute("DELETE FROM users WHERE username=?", [user])
}

const getUserByUsername = async (username) => {
    const [rows, fields] = await connectDB.execute('SELECT * FROM `users` WHERE `username`=?', [username]);
    return rows[0]; // Trả về người dùng nếu có, nếu không sẽ trả về undefined
};

const insertAdmin = async (userid, username,password, fullname, address, sex, email, role) => { 
    const [rows, fields] = await connectDB.execute(
        'INSERT INTO `users` VALUES (?, ?, ?, ?, ?, ?, ?, ?)', 
        [
            userid,
            username, 
            password, 
            fullname,    
            address,     
            sex, 
            email,       
            role,        
        ]
    );
    return rows;
}

//Thông tin người dùng client
const getUserById = async (userid) => {
    try {
        const [rows] = await connectDB.execute('SELECT * FROM `users` WHERE `userid` = ?', [userid]);
        return rows[0]; // Trả về người dùng đầu tiên tìm thấy (hoặc undefined nếu không có)
    } catch (error) {
        console.error("Lỗi khi lấy thông tin người dùng theo ID:", error);
        throw error;
    }
};

const updateUserDetail = async (userid, fullname, email, sex, address) => {
    try {
        const [result] = await connectDB.execute(
            "UPDATE users SET fullname = ?, email = ?, sex = ?, address = ? WHERE userid = ?",
            [fullname, email, sex, address, userid]
        );
        return result; // Trả về kết quả của thao tác cập nhật
    } catch (error) {
        console.error("Lỗi khi cập nhật thông tin người dùng:", error);
        throw error;
    }
};
export default { getAllUser, detailUser, updateUser, deleteUser, insertUser, isUserExist, getUserByUsername, insertAdmin, getUserById, updateUserDetail}