// 导入 mongoose
const mongoose = require('mongoose')

// 创建结构对象
let UserSchema = new mongoose.Schema({
    // 用户名
    username: String,
    // 密码
    password: String
})

// 创建模型对象
let UserModel = mongoose.model('users', UserSchema)

// 对外暴露模型对象
module.exports = UserModel