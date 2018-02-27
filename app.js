var fs=require('fs');
var utils = require('./utils');
var { exec } = require('child_process');
var path=require('path');

fs.readFile('./config.json',function(err, data){
    var config=JSON.parse(data)
    var q=config.project.find(function(item){
        return item.name=='区域分部'
    })
    console.log(q)
})

// function fsExistsSync(path) {
//     try{
//         fs.accessSync(path,fs.F_OK);
//     }catch(e){
//         return false;
//     }
//     return true;
// }

// if(fsExistsSync('mall')){
//     console.log('cunzai')
//     exec(
//         `cd mall && git pull && cnpm i && npm run build`,
//         function(error, stdout, stderr){
//             if (error) {
//                 console.error(`exec error: ${error}`);
//                 return;
//             }else{
//                 var path1=path.resolve(__dirname,'mall/dist')
//                 var path2=`D:\\test\\dist`
//                 utils.copy(path1,path2)
//             }
//             console.log(`stdout: ${stdout}`);
//             //   console.log(`stderr: ${stderr}`);
//         }
//     );
// }else{
//     exec(
//         `git clone git@github.com:826327700/mall.git`,
//         function(error, stdout, stderr){
//             if (error) {
//                 console.error(`exec error: ${error}`);
//                 return;
//               }
//               console.log(`stdout: ${stdout}`);
//               console.log(`stderr: ${stderr}`);
//         }
//     );
// }