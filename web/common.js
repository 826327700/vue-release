var fs=require('fs');
var path=require('path');
var config=function(){
    var data=require('../config.js');
    console.log(data)
    return data
}
module.exports.config=config()