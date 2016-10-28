module.exports = function(adapter, notice, config){
  var start = function(done){
    var register = function(queueName, action){
      adapter.registerConsume(queueName, function(msg, cb){
        console.log('Received message on ' + queueName + ':', msg.content.toString());
        var data = JSON.parse(msg.content.toString());
        action(data);
        cb(true);
      });
    };

    register(config.queues.Q_USER_JOINED, notice.userJoined);
    register(config.queues.Q_ITEM_ADDED, notice.itemAdded);

    done();
  };

  return {
    start : start
  }
};
