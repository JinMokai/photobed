const http = require("http")
const path = require("path")
const { koaBody } = require("koa-body");
const static = require("koa-static")
const render = require('koa-art-template')
const router = require("./router")

const koa = require("koa")
const app = new koa()

console.log(path.join(__dirname, "./upload"))
// 静态文件处理
app.use(static(path.join(__dirname, "./upload")))
// 模板引擎配置
render(app, {
    root: path.join(__dirname, './src/views'), // 模板文件目录
    extname: '.art'
})

app.use(koaBody({
    multipart: true, // 支持文件上传
    formidable: {
        uploadDir: path.join(__dirname, "./upload"), // 设置文件上传目录
        keepExtensions: true, // 保持文件的后缀
        maxFieldsSize: 2 * 1024 * 1024, // 文件上传大小
    },
}))

// 注册路由中间件
app.use(router.routes())
// 如果要在错误处理中使用，也需要加上下面这行代码
app.use(router.allowedMethods())
// 如果没有匹配到数据统一返回结果
app.use(async (ctx, next) => {
    ctx.body = {
        "code": 404,
        "message": "没有找到数据！"
    }
})
// 没有匹配的数据就返回
let server = http.createServer(app.callback())
const port = 3000
server.listen(port, () => {
    console.log(`server is running on http://localhost:${port}`)
})