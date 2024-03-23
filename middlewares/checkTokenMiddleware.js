// 导入 jwt
const jwt = require('jsonwebtoken')
// 导入配置项
const {secret} = require('../config/config')

// 校验 token 的中间件
module.exports = (req, res, next) => {
    // 获取 token
    let token = req.get('token')
    // 判断是否有 token
    if (!token) {
        return res.json({
            code: '2003',
            msg: 'token 缺失！',
            data: null
        })
    }
    // 校验 token
    jwt.verify(token, secret, (err, data) => {
        // 判断 token 是否正确
        if (err) {
            return res.json({
                code: '2004',
                msg: 'token 校验失败！',
                data: null
            })
        }
        // 保存用户信息
        req.user = data
        // token 校验通过
        next()
    })
}