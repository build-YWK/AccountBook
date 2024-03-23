// 导入 express
const express = require('express')
// 导入 UserModel
const UserModel = require('../../model/UserModel')
// 导入 md5（安装 md5：npm i md5）
const md5 = require('md5')

// 创建路由对象
const router = express.Router()

// 注册页面
router.get('/reg', (req, res) => {
    // 响应 HTML 内容
    res.render('auth/reg')
})

// 用户注册
router.post('/reg', (req, res) => {
    // 将注册的信息存入数据库中
    UserModel.create({...req.body, password: md5(req.body.password)}).then(() => {
        res.render('reminder/success', {msg: '注册成功', url: '/login'})
    }).catch(() => {
        res.status(500).send('注册失败，请稍后再试！')
    })
})

// 登录页面
router.get('/login', (req, res) => {
    // 响应 HTML 内容
    res.render('auth/login')
})

// 用户登录
router.post('/login', (req, res) => {
    // 获取用户输入的用户名和密码
    let {username, password} = req.body
    // 查询数据库
    UserModel.findOne({username: username, password: md5(password)}).then((data) => {
        // 判断 data
        if(!data) {
            return res.send('账号或密码错误')
        }
        // 写入 session
        req.session.username = data.username
        req.session._id = data._id

        // 登录成功响应
        res.render('reminder/success', {msg: '登录成功', url: '/account'})
    }).catch(() => {
        res.status(500).send('登录失败，请稍后再试！')
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