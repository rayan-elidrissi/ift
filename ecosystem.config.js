module.exports = {
  apps: [
    {
      name: 'ift-app',
      script: 'node_modules/.bin/next',
      args: 'start',
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
      },
      log_file: '/var/log/pm2/ift-app.log',
      rotate_logs: true,
      max_size: '50M',
      retain: 10,
    },
  ],
}
