module.exports = {
    devServer: {
        port: 80,
        proxy: {
            //配置跨域
            '/api': {
                target: "http://localhost:7000",
                ws: true,
                changOrigin: true,
                pathRewrite: {
                    '^/api': ''
                }
            },
            'admin': {
                target: "http://localhost:8080",
                ws: true,
                changOrigin: true,
                pathRewrite: {
                    '^/admin': ''
                }
            }
        }
    }
}
