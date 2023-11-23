const cors = require('cors')

// 允許的來源域名，根據你的需求進行修改
const allowedOrigins = ['http://192.168.50.173:8080', 'http://localhost:3000', 'http://192.168.0.84:8080', '*']

// 其他 CORS 配置選項
const corsOptions = {
  origin: (origin, callback) => {
    // 如果請求的來源在允許的來源列表中或者沒有來源信息（例如直接訪問接口），則允許訪問
    if (allowedOrigins.includes(origin) || !origin) {
      callback(null, true)
    } else {
      callback(new Error('不被 CORS 允許'))
    }
  },
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  exposedHeaders: 'Token', // 允許暴露的響應頭
  credentials: true, // 是否支持跨域凭證
  optionsSuccessStatus: 204, // 預檢請求成功的狀態碼
  maxAge: 10000 // 預檢請求的緩存時間，單位秒
}

module.exports = cors(corsOptions)
