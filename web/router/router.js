var express = require('express');
var router = express.Router();
var config = require('../common.js').config;
var release=require('../controller/release.js');
// 该路由使用的中间件
router.use(function timeLog(req, res, next) {
  if(!req.session.user&&req.path!='/login'){
    res.redirect('/login');
  }else{
    next();
  }
  
});
// 定义网站主页的路由
router.get('/', function(req, res) {
    var project=config.project
    res.render('index', { title: 'Hey', project:project});
});
// 定义 登录 页面的路由
router.get('/login', function(req, res) {
    
    res.render('login',{msg:''});
});

router.post('/login',function(req, res){
    var user=config.user.find(item=>{
        return req.body.username==item.username&&req.body.password==item.password
    })
    if(user){
        req.session.user = 'xiaobaozi'+Math.floor(Math.random()*10+1);
        res.cookie('user', req.session.user, { path: '/',maxAge:60000});
        res.redirect('/')
    }else{
        res.render('login',{msg:'登录失败'});
    }
})

// 定义 编译 页面的路由
router.get('/release', function(req, res) {
    setTimeout(() => {
        var sockets=require('../../index.js')
        var socket=sockets.sockets[req.session.user]
        
        for(var k in sockets.sockets){
            console.log(k)
        }
        if(socket){
            release(req.query.id,socket,function(error, stdout, stderr){
                if (error) {
                    console.error(`exec error: ${error}`);
                    return;
                }
            })
        }
        
    }, 1000);
    
    res.render('release', { title: 'Hey'});
});

// 定义 编译结果 页面的路由
router.get('/complete', function(req, res) {
    if(req.query.state=='success'){
        res.end("编译成功")
    }else{
        res.end("编译失败")
    }
});

module.exports = router;