const bcrypt = require('bcryptjs')
const { User, Address } = require('../models')

const userServices = {
  signUp: (req, callback) => {
    if (req.body.password !== req.body.passwordCheck) throw new Error('Passwords do not match!')
    User.findOne({ where: { email: req.body.email } })
      .then(user => {
        if (user) {
          const err = new Error('Email has already exist')
          err.status = 422
          throw err
        }
        return bcrypt.hash(req.body.password, 10)
      })
      .then(hash => User.create({
        email: req.body.email,
        name: req.body.name,
        password: hash
      }))
      .then(user => {
        // 創建對應的地址信息
        return Address.create({
          userId: user.id,
          city: '',
          detail: '',
          recevier: '',
          phone: ''
        })
      })
      .then(() => callback(null))
      .catch(err => callback(err))
  }
}
module.exports = userServices
