var app = require('http').createServer(function(req,res){});
var amqp = require('amqplib/callback_api');
var io = require('socket.io')(app);
var config = require('./config');

io.serveClient(false);


/*
var host = 'redis-17922.c10.us-east-1-3.ec2.cloud.redislabs.com';
var port = redis-17922;
var password = 'P@ssw0rd';
var redis = require('redis').createClient;
var adapter = require('socket.io-redis');
var pub = redis(port, host, { auth_pass: password });
var sub = redis(port, host, { return_buffers: true, auth_pass: password });
io.adapter(adapter({ pubClient: pub, subClient: sub }));
*/

//io.adapter(adapter({ host: 'redis-17922.c10.us-east-1-3.ec2.cloud.redislabs.com', port: 17922 }));
var adapter = require('socket.io-redis');
io.adapter(adapter({ host: 'localhost', port: 6379 }));

io.set('origins', config.origins);

io.on('connection', require('./rt/register')(config));

require('./mq/connection')(amqp, config.mqcon).connect(function(adapter){
  app.listen(3211, function(){
    var notice = require('./rt/notice')(io, config);
    require('./rt/receiver')(adapter, notice, config).start(function(){
        console.log('Server is running...');
    });
  });
});
