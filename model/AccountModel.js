// 导入 mongoose
const mongoose = require('mongoose')

// 创建结构对象
let AccountSchema = new mongoose.Schema({
    // 标题
    title: {
        type: String,
        required: true
    },
    // 时间
    time: Date,
    // 类型（1表示收入，-1表示支出）
    type: {
        type: Number,
        default: -1,
        enum: [1, -1]
    },
    // 金额
    account: {
        type: Number,
        required: true
    },
    // 备注
    remarks: String
})

// 创建模型对象
let AccountModel = mongoose.model('account', AccountSchema)

// 对外暴露模型对象
module.exports = AccountModel