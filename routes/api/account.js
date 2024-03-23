/**
 * 该文件是用来创建记账单接口：
 *      1.获取账单列表接口
 *      2.创建账单接口
 *      3.删除账单接口
 *      4.获取单条账单接口
 *      5.更新单个账单接口
 */
// 导入 express
const express = require('express')
// 导入 moment  --- 用来修改时间的格式
const moment = require('moment')
// 导入 AccountModel
const AccountModel = require('../../model/AccountModel')
// 导入 jwt
const jwt = require('jsonwebtoken')
// 导入中间件校验 token
const checkTokenMiddleware = require('../../middlewares/checkTokenMiddleware')

// 创建路由对象
const router = express.Router()

// 1.获取账单列表接口
router.get('/account', checkTokenMiddleware, function (req, res) {
  console.log(req.user)
  // 获取集合信息
  AccountModel.find().sort({ time: -1 }).then((data) => {
    // 成功的响应
    res.json({
      // 响应编号（一般用 20000 或 0000 来表示成功）
      code: '0000',
      // 响应的信息
      msg: '读取成功',
      // 响应的数据
      data: data
    })
  }).catch(() => {
    // 失败的响应
    res.json({
      code: '1001',
      msg: '读取失败',
      data: null
    })
  })
});

// 2.创建账单接口
router.post('/account', checkTokenMiddleware, (req, res) => {
  AccountModel.create({
    ...req.body,
    // 修改 time 的值
    time: moment(req.body.time).toDate()
  }).then((data) => {
    // 成功提醒
    res.json({
      code: '0000',
      msg: '创建成功',
      data: data
    })
  }).catch(() => {
    res.json({
      code: '1002',
      msg: '创建失败',
      data: null
    })
  })
})

// 3.删除账单接口
router.delete('/account/:id', checkTokenMiddleware, (req, res) => {
  // 获取要删除记录的id
  let id = req.params.id
  // 删除数据库中的数据
  AccountModel.deleteOne({ _id: id }).then(() => {
    // 删除提醒
    res.json({
      code: '0000',
      msg: '删除成功',
      data: {}
    })
  }).catch(() => {
    res.json({
      code: '1003',
      msg: '删除失败',
      data: null
    })
  })
})

// 4.获取单条账单接口
router.get('/account/:id', checkTokenMiddleware, (req, res) => {
  // 获取单条账单的 id
  let id = req.params.id
  // 根据 id 去查询对应的账单
  AccountModel.findById(id).then((data) => {
    // 成功响应
    res.json({
      code: '0000',
      msg: '查询成功',
      data: data
    })
  }).catch(() => {
    // 失败响应
    res.json({
      code: '1004',
      msg: '查询失败',
      data: null
    })
  })
})

// 5.更新单个账单接口（patch：局部更新  put：整体替换掉）
router.patch('/account/:id', checkTokenMiddleware, (req, res) => {
  // 获取单条账单的 id
  let { id } = req.params
  // 根据 id 去更新账单信息
  AccountModel.updateOne({ _id: id }, req.body).then(() => {
    // 再次查询数据库，来获取更新后的账单信息
    AccountModel.findById(id).then((data) => {
      res.json({
        code: '0000',
        msg: '更新成功',
        data: data
      })
    }).catch(() => {
      res.json({
        code: '1004',
        msg: '查询失败',
        data: null
      })
    })
  }).catch(() => {
    res.json({
      code: '1005',
      msg: '更新失败',
      data: null
    })
  })
})

module.exports = router;