var fs=require('fs');
var path=require('path');
var config=function(){
    var data=require('../config.js');
    return data
}
module.exports.config=config()