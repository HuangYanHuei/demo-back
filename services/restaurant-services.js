const { Restaurant, Category, User, Comment, Product, Productcategory, Address } = require('../models')
const Sequelize = require('sequelize')
const { Op } = Sequelize
const { getOffset, getPagination } = require('../helpers/pagination-helper')
const restaurantServices = {
  getRestaurants: (req, callback) => {
    const DEFAULT_LIMIT = 9
    const categoryId = Number(req.query.categoryId) || ''
    const page = Number(req.query.page) || 1
    const limit = Number(req.query.limit) || DEFAULT_LIMIT
    const offset = getOffset(limit, page)
    Promise.all([
      Restaurant.findAndCountAll({
        include: Category,
        where: {
          ...categoryId ? { categoryId } : {}
        },
        limit,
        offset,
        nest: true,
        raw: true
      }),
      Category.findAll({ raw: true })
    ])
      .then(([restaurants, categories]) => {
        const favoritedRestaurantsId = req.user?.FavoritedRestaurants ? req.user.FavoritedRestaurants.map(fr => fr.id) : []
        const likedRestaurantsId = req.user?.LikedRestaurants ? req.user.LikedRestaurants.map(lr => lr.id) : []
        const data = restaurants.rows.map(r => ({
          ...r,
          description: r.description.substring(0, 50),
          isFavorited: favoritedRestaurantsId.includes(r.id),
          isLiked: likedRestaurantsId.includes(r.id)
        }))

        const pagination = getPagination(limit, page, restaurants.count)

        return callback(null, {
          restaurants: data,
          categories,
          categoryId,
          pagination
        })
      })
      .catch(err => callback(err))
  },
  getRestaurant: (req, callback) => {
    Promise.all([
      Restaurant.findByPk(req.params.id, {
        include: [Category,
          {
            model: Product,
            include: [Productcategory]
          },
          { model: Comment, include: User },
          { model: User, as: 'FavoritedUsers' },
          { model: User, as: 'LikedUsers' }
        ]
      }),
      Productcategory.findAll({ raw: true })
    ])
      // .then(restaurant => {
      //   if (!restaurant) throw new Error("Restaurant didn't exist!")
      //   return restaurant.increment('viewCounts')
      // })
      .then(([restaurant, productcategories]) => {
        const isFavorited = restaurant.FavoritedUsers.some(f => f.id === req.user.id)
        const isLiked = restaurant.LikedUsers.some(f => f.id === req.user.id)
        return callback(null, {
          restaurant: restaurant.toJSON(),
          isFavorited,
          isLiked,
          productcategories
        })
      })
      .catch(err => callback(err))
  },
  getSearch: (req, callback) => {
    const searchName = req.query.keyword || ''
    console.log(searchName)
    Restaurant.findAll({
      include: [Category, {
        model: Product,
        include: [Productcategory]
      }],
      where: {
        name: {
          [Sequelize.Op.like]: `%${searchName}%`
        }
      },
      nest: true,
      raw: true
    })
      .then(restaurants => {
        const result = []
        const addedRestaurants = {}
        restaurants.forEach(restaurant => {
          const restaurantId = restaurant.id
          if (!addedRestaurants[restaurantId]) {
            result.push({
              ...restaurant,
              Products: []
            })
            addedRestaurants[restaurantId] = true
          }
          const lastAddedRestaurant = result[result.length - 1]
          lastAddedRestaurant.Products.push({
            id: restaurant.Products.id,
            name: restaurant.Products.name,
            image: restaurant.Products.image,
            price: restaurant.Products.price,
            description: restaurant.Products.description,
            isShowProduct: 1
          })
        })
        return callback(null, {
          restaurants: result
        })
      })
      .catch(err => callback(err))
  },
  getAddress: (req, callback) => {
    const { id } = req.params
    User.findByPk(id, {
      include: Address
    })
      .then(user => {
        const address = user.Addresses
        return callback(null,
          address[0]
        )
      })
      .catch(err => callback(err))
  },
  postAddress: (req, callback) => {
    const { id, phone, detail, city, receiver } = req.query
    Address.findByPk(id)
      .then(address => {
        if (!address) throw new Error("Address didn't exist!")
        return address.update({
          phone,
          detail,
          city,
          receiver
        })
      })
      .then(() => {
        return callback(null, {
          id, phone, detail, city, receiver
        })
      })
      .catch(err => callback(err))
  }

}
module.exports = restaurantServices
