module.exports = {
  origins:'http://microservice-seneca-js-linhle.codeanyapp.com:*'
    +' http://domain.com:*'
    +' http://domain.org:*'
    +' http://domain.net:*'
    +' http://domain.gov:*'
    +' http://localhost:*'
    +' http://hoantran.com:*'
    +' http://192.168.1.79:*',
  mqcon : 'amqp://vlqtfukt:72ee0WhIwOcR-utyQSlZbfAsNhu5CixT@white-mynah-bird.rmq.cloudamqp.com/vlqtfukt?heartbeat=60',
  queues: {
    Q_USER_JOINED : 'collaborative-ordering-user-joined',
    Q_ITEM_ADDED : 'collaborative-ordering-item-added'
  },
  keys: {
    group_prefix : 'collaborative:cart:rt:group:'
  }
};
