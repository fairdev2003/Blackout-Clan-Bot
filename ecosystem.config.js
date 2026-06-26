module.exports = {
  apps: [{
    name: "blackout-clan-bot",         
    script: "build/main.js",           
    cwd: "/root/blackout-bot",         
    interpreter: "node",               
    env: {
      NODE_ENV: "production",
    }
  }]
}