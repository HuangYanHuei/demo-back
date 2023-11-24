const userServices = require('../../services/user-services')
const jwt = require('jsonwebtoken')
const db = require('../../models')
const bcrypt = require('bcryptjs')
const User = db.User
const userController = {
  signIn: (req, res, next) => {
    // 檢查必要資料
    if (!req.body.email || !req.body.password) {
      return res.json({ status: 'error', message: "required fields didn't exist" })
    }
    // 檢查 user 是否存在與密碼是否正確
    const email = req.body.email
    const password = req.body.password

    User.findOne({ where: { email: email } })
      .then(user => {
        if (!user) return res.status(401).json({ status: 'error', message: 'no such user found' })
        if (!bcrypt.compareSync(password, user.password)) {
          return res.status(401).json({ status: 'error', message: 'passwords did not match' })
        }

        // 簽發 token
        const payload = { id: user.id }
        const token = jwt.sign(payload, process.env.JWT_SECRET)
        return res.json({
          status: 'success',
          message: 'ok',
          token: token,
          user: {
            id: user.id, name: user.name, email: user.email, isAdmin: user.isAdmin
          }
        })
      })
      .catch(err => {
        next(err)
      })
  },
  signUp: (req, res, next) => {
    userServices.signUp(req, err => err ? next(err) : res.json({ status: 'success' }))
  },
  putUser: (req, res, next) => {
    userServices.putUser(req, err => err ? next(err) : res.json({ status: 'success' }))
  },
  getCurrentUser: (req, res) => {
    return res.json({
      id: req.user.id,
      name: req.user.name,
      email: req.user.email,
      image: req.user.image,
      isAdmin: req.user.isAdmin
    })
  }
}
module.exports = userController
