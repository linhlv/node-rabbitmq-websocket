/*
adapter.registerConsume('jobs', function(msg, cb){
  console.log("PDF processing of ", msg.content.toString());
  cb(true);
});

adapter.registerConsume('jobs2', function(msg, cb){
  console.log("PDF processing of ", msg.content.toString());
  cb(true);
});
*/


/*
var notice = require('./rt/notice')(io);
var receiver = require('./mq/receiver')(notice);

require('./mq/worker')(amqp, receiver, qcn);
*/


/*

setInterval(function() {
  adapter.publish("", "jobs", new Buffer("work work work"));
}, 1000);

*/
