module.exports = {
  apps: [
    {
      name: 'bevnpay-staging',
      script: 'dist/main.js',
      cwd: '/www/wwwroot/staging/bevnpay',
      instances: 1,
      exec_mode: 'fork',
      env: {
        NODE_ENV: 'staging',
        PORT: 4100,
        MONGO_URI: 'mongodb://127.0.0.1:27017/ecommerce_staging'
      }
    }
  ]
}

