module.exports = {
  apps: [
    {
      name: 'bevnpay',
      script: 'dist/main.js',
      cwd: './',
      instances: 1,
      exec_mode: 'fork', 
      autorestart: true,
      watch: false,
      max_memory_restart: '500M',
      env: {
        NODE_ENV: 'production',
        PORT: 4000,
        MONGO_URI: 'mongodb://127.0.0.1:27017/ecommerce'
      }
    }
  ]
};
