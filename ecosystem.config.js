module.exports = {
  apps: [
    {
      name: 'bevnpay',
      script: 'dist/main.js',
      cwd: './',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '500M',
      env: {
        NODE_ENV: 'production',
        PORT: 4000,
        MONGO_URI: 'mongodb://localhost:27017/ecommerce'
      }
    }
  ]
};
