const bcrypt = require('bcryptjs')
const { User, Address } = require('../models')
const { imgurFileHandler } = require('../helpers/file-helpers')

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
  },
  putUser: async (req, callback) => {
    const id = req.headers['user-id']
    const { name } = req.body
    if (!name) throw new Error('User name is required!')
    const { file } = req
    return Promise.all([
      await User.findByPk(id),
      await imgurFileHandler(file)
    ])
      .then(([user, filePath]) => {
        if (!user) throw new Error("User didn't exist!")
        return user.update({
          name,
          image: filePath || user.image
        })
      })
      .then(() => callback(null))
      .catch(err => callback(err))
  }
}
module.exports = userServices
