let OSS = require('ali-oss')
let fs = require('fs')
var path = require('path')

let client = new OSS({
    region: 'oss-cn-beijing',
    accessKeyId: 'LTAI8fP1aiP7biXl',
    accessKeySecret: 'aZvcuCAlvBv9xGcnGZDxMzyYJA8Hej',
    bucket: 'loong-res',
    timeout: 30000
})
console.log(process.argv)
if (!process.argv[2] || !process.argv[3]) {
    return
}
var localPath = process.argv[2]
var remotePath = process.argv[3]
var fileDic = []



readDir(localPath)
function readDir (filePath) {
    var fileList = fs.readdirSync(filePath)
    fileList.forEach(function (filename, index) {
        var file = path.join(filePath, filename)
        var info = fs.statSync(file)

        // 目录
        if (info.isDirectory()) {
            readDir(file)
        }
        // 文件
        else {
            // 添加到上传列表
            var localDir = path.join(filePath, filename)
            var remoteDir = path.join(remotePath, localDir.replace('dist', ''))

            fileDic.push({
                remoteDir: remoteDir,
                localDir: localDir
            })
        }
    })
}

async function updates () {
    try {
        for (var item of fileDic) {
            var result = await client.put(item['remoteDir'], item['localDir'])
            console.log("upload from '" + item['remoteDir'] + "' to '" + item['localDir'] + "'")
        }
    } catch (error) {
        console.log(error)
    }
}

updates()
