var amqp = require('amqplib/callback_api');
var config = require('./config');

require('./mq/connection')(amqp, config.mqcon).connect(function(adapter){
  console.log('amqp connected.');
  for(var i=0;i<5;i++){
    //adapter.publish("", "jobs");

    var json ={
      group : 'group1',
      result: {

      }
    };

    var jsonString = JSON.stringify(json);

    adapter.publish('', 'collaborative-ordering-user-joined', new Buffer(jsonString) );
    console.log('delivered: ' + i);
  }
});
