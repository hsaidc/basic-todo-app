module.exports = {
  apps: [
    {
      name: "todo-app-backend",
      script: "./api/server.js",
      instances: "1",
      autorestart: true,
      watch: true,
      max_memory_restart: "1G",
      env: {
        NODE_ENV: "production",
      },
    },
  ],
};
