const Router = require("koa-router")
const fs = require("fs")
const path = require("path")
const dirTime = require("./src/utils/tools")
const router = new Router()

router.get("/", async (ctx, next) => {
    await ctx.render("index")
})

router.post("/upload", async (ctx, next) => {
    const { file } = ctx.request.files
    const oldPath = file.filepath; // 上传文件在服务器端的保存路径
    const newPath = `./upload/${dirTime}/${file.newFilename}`; // 上传文件要被移动到的目标位置

    const dirPath = newPath.slice(0, newPath.lastIndexOf('/'));
    try {
        fs.mkdir(dirPath, { recursive: true }, (err) => {
            if (err && err.code !== 'EEXIST') throw err;
            console.log('文件夹已经创建或已经存在：' + dirPath);
        });
        fs.rename(oldPath, newPath, (err) => {
            if (err) throw err;
            console.log('上传文件已经被移动到：' + path.join(__dirname, newPath));
        });
    } catch (err) {
        console.error(err)
        return "error!"
    }
    // 将文件路径替换一下
    const str = newPath;
    const newStr = str.replace("./upload/", '');
    ctx.body = {
        "imgurl": `http://localhost:3000/${newStr}`,
        "code": 200
    }
})

module.exports = router