var fs=require('fs');
var utils = require('../utils');
var { exec } = require('child_process');
var path=require('path');
var config = require('../common.js').config;

function release(id,socket,cb){
    var project=config.project.find(item=>{
        return item.id==id
    })

    function fsExistsSync(path) {
        try{
            fs.accessSync(path,fs.F_OK);
        }catch(e){
            return false;
        }
        return true;
    }

    function build(){
        socket.emit('step', { msg: '正在更新代码...' });
        exec(
            `cd ${projectPath} && git pull`,
            function(error, stdout, stderr){
                if (error) {
                    console.error(`exec error: ${error}`);
                    socket.emit('step', { msg: '更新代码失败...' });
                    socket.emit('detail', { msg: error });
                    return;
                }else{
                    socket.emit('detail', { msg: stdout });
                    socket.emit('step', { msg: '更新代码成功...' });
                    socket.emit('step', { msg: '正在更新依赖...' });
                    exec(`cd ${projectPath} && cnpm i`,function(error, stdout, stderr){
                        if(error){
                            console.error(`exec error: ${error}`);
                            socket.emit('step', { msg: '更新依赖失败...' });
                            socket.emit('detail', { msg: error });
                            return;
                        }else{
                            console.log(stdout)
                            console.log(stderr)
                            socket.emit('detail', { msg: stdout });
                            socket.emit('step', { msg: '更新依赖成功...' });
                            socket.emit('step', { msg: '正在编译代码...' });
                            exec(`cd ${projectPath} && npm run build`,function(error, stdout, stderr){
                                if(error){
                                    socket.emit('step', { msg: '编译代码失败...' });
                                    console.error(`exec error: ${error}`);
                                    socket.emit('detail', { msg: error });
                                    return;
                                }else{
                                    console.log(stdout.toString())
                                    socket.emit('detail', { msg: stdout.toString() });
                                    socket.emit('step', { msg: '编译代码成功...' });
                                    socket.emit('step', { msg: '正在部署...' });
                                    var path1=`${projectPath}/dist`
                                    var path2=project.sitePath
                                    utils.copy(path1,path2)
                                    socket.emit('step', { msg: '部署成功...' });
                                    cb(error, stdout, stderr)
                                }
                            })
                        }
                    })
                    
                }
                console.log(`stdout: ${stdout}`);
                //   console.log(`stderr: ${stderr}`);
                
            }
        );
    }

    var gitFolder=path.resolve(__dirname,`../../${project.gitFolder}`)
    var projectFolder=process.cwd()+'\\'+config.global.projectFolder
    if(fsExistsSync(gitFolder)){
        build()
    }else{
        socket.emit('step', { msg: '项目源码不存在，正在拉取...' });
        exec(
            `cd ${projectFolder} && git clone ${project.git}`,
            function(error, stdout, stderr){
                if (error) {
                    console.error(`exec error: ${error}`);
                    socket.emit('step', { msg: '拉取代码失败...' });
                    socket.emit('detail', { msg: error });
                    return;
                }
                socket.emit('step', { msg: '拉取代码成功...' });
                socket.emit('detail', { msg: stdout });
                console.log(`stdout: ${stdout}`);
                console.log(`stderr: ${stderr}`);
                build()
            }
        );
    }
}
module.exports=release