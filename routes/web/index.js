// 导入 express
const express = require('express')
// 导入 moment  --- 用来修改时间的格式
const moment = require('moment')
// 导入 AccountModel
const AccountModel = require('../../model/AccountModel')
// 导入中间件检查登录
const checkLoginMiddleware = require('../../middlewares/checkLoginMiddleware')

// 创建路由对象
const router = express.Router()

// 记账本的首页
router.get('/', (req, res) => {
  // 重定向
  res.redirect('/account')
})

// 记账本的列表
router.get('/account', checkLoginMiddleware, function(req, res, next) {
  // 读取集合信息
  AccountModel.find().sort({time: -1}).then((data) => {
    // 响应成功
    res.render('bill/list', {accounts: data, moment})
  }).catch(() => {
    res.status(500).send('读取失败！')
  })
});

// 添加记录
router.get('/account/create', checkLoginMiddleware, function(req, res, next) {
  res.render('bill/add')
});

// 新增记录
router.post('/account', checkLoginMiddleware, (req, res) => {
  // 判断写入的文件是否为空
  let {title, time, account} = req.body
  if(!title || !time || !account) {
    res.render('reminder/fail', {msg: '添加失败哦~~~', url: '/account'})
    return
  }
  // 向数据库插入数据
  AccountModel.create({
    ...req.body,
    // 修改 time 的值
    time: moment(req.body.time).toDate()
    // time: new Date(req.body.time)
  }).then(() => {
    // 成功提醒
    res.render('reminder/success', {msg: '添加成功哦~~~', url: '/account'})
  }).catch(() => {
    res.status(500).send('添加失败！')
  })
})

// 删除记录
router.get('/account/:id', checkLoginMiddleware, (req, res) => {
  // 获取要删除记录的id
  let id = req.params.id
  // 删除数据库中的数据
  AccountModel.deleteOne({_id: id}).then(() => {
    // 删除提醒
    res.render('reminder/success', {msg: '删除成功哦~~~', url: '/account'})
  }).catch(() => {
    res.status(500).send('删除失败！')
  })
})

module.exports = router;
