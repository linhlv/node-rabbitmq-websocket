var app = require('http').createServer(function(req,res){});
var amqp = require('amqplib/callback_api');
var io = require('socket.io')(app);
var config = require('./config');

io.serveClient(false);

io.set('origins', config.origins);

io.on('connection', require('./rt/register')(config));

require('./mq/connection')(amqp, config.mqcon).connect(function(adapter){
  app.listen(3210, function(){
    var notice = require('./rt/notice')(io, config);
    require('./rt/receiver')(adapter, notice, config).start(function(){
        console.log('Server is running...');
    });
  });
});
