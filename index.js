var express = require('express');
var app = express();
var session = require('express-session');
var cookie = require('cookie-parser');
var bodyParser = require('body-parser');
var router = require('./web/router/router');

app.use(bodyParser.urlencoded({
    extended:true
}));
app.use(session({ 
    ////这里的name值得是cookie的name，默认cookie的name是：connect.sid
      //name: 'hhw',
      secret: 'keyboard cat', 
      cookie: ('name', 'value', { path: '/', httpOnly: true,secure: false, maxAge:  60000 }),
      //重新保存：强制会话保存即使是未修改的。默认为true但是得写上
      resave: true, 
      //强制“未初始化”的会话保存到存储。 
      saveUninitialized: true,  
}))
app.use(cookie())
app.set('views', './web/views');
app.set('view engine', 'ejs');
app.use(express.static('web/static'));


var server = app.listen(3000, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});


var io = require('socket.io')(server);
app.use(function(request, response, next){
	response.locals.io=io;
	next();
});

var sockets={}
io.on('connection', function (socket) {
	function getCookie(name)
	{
	var arr,reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)");
	if(arr=socket.request.headers.cookie.match(reg))
	return unescape(arr[2]);
	else
	return null;
	}
	var user=getCookie('user')
	console.log("连接"+user)
	if(user){
		sockets[user]=socket
	}
})
app.use('/', router);
module.exports.sockets=sockets