module.exports = {
    apps: [
      {
        name: "app",
        script: "npm",
        args: "start",
        env: {
          PORT: 4800, // porta de execucao do app
          NODE_ENV: "production"
        }
      }
    ]
  };