var fs=require('fs');
var path=require('path');
var config=function(){
    var data=fs.readFileSync(path.resolve(__dirname,'../config.json'))
    return JSON.parse(data)
}
module.exports.config=config()