const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
  app.use(
    "/api",
    createProxyMiddleware({
      target: "http://localhost:5002", // <--- config the url based on your backend server
      changeOrigin: true,
    })
  );
};
