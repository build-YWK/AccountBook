// 导入 express
const express = require('express')
// 导入 UserModel
const UserModel = require('../../model/UserModel')
// 导入 md5（安装 md5：npm i md5）
const md5 = require('md5')
// 导入 jwt
const jwt = require('jsonwebtoken')
// 导入配置项
const {secret} = require('../../config/config')

// 创建路由对象
const router = express.Router()

// 用户登录
router.post('/login', (req, res) => {
    // 获取用户输入的用户名和密码
    let {username, password} = req.body
    // 查询数据库
    UserModel.findOne({username: username, password: md5(password)}).then((data) => {
        // 判断 data
        if(!data) {
            return res.json({
                code: '2002',
                msg: '用户名或密码错误！',
                data: null
            })
        }
        // 创建当前用户的token
        let token = jwt.sign({
            username: data.username,
            _id: data._id
        }, secret, {
            expiresIn: 60 * 60 * 24 * 7
        })

        // 响应 token
        res.json({
            code: '0000',
            msg: '登录成功',
            data: token
        })
    }).catch(() => {
        res.json({
            code: '2001',
            msg: '数据库读取失败！',
            data: null
        })
    })
})

// 退出登录
router.post('/logout', (req, res) => {
    // 销毁 session
    req.session.destroy(() => {
        res.render('reminder/success', {msg: '退出成功', url: '/login'})
    })
})

module.exports = router;