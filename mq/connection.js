module.exports = function(amqp, qcn){
  var amqpConn = null;
  var pubChannel = null;
  var offlinePubQueue = [];

  var publish = function (exchange, routingKey, content) {
    try {
      pubChannel.publish(exchange, routingKey, content, { persistent: true },
                        function(err, ok) {
                          if (err) {
                            console.error("[AMQP] publish", err);
                            offlinePubQueue.push([exchange, routingKey, content]);
                            pubChannel.connection.close();
                          }
                      "jobs"  });
    } catch (e) {
      console.error("[AMQP] publish", e.message);
      offlinePubQueue.push([exchange, routingKey, content]);
    }
  };

  var registerConsume = function(queueName, rccb){
    amqpConn.createChannel(function(err, ch) {
       if (closeOnErr(err)) return;
       ch.on("error", function(err) {
         console.error("[AMQP] channel error", err.message);
       });
       ch.on("close", function() {
         console.log("[AMQP] channel closed");
       });

       ch.prefetch(10);
       ch.assertQueue(queueName, { durable: true }, function(err, _ok) {
         if (closeOnErr(err)) return;
         ch.consume(queueName, function(msg){
           rccb(msg, function(ok) { //work function (msg, callback(boolean))
             try {
               if (ok)
                 ch.ack(msg);
               else
                 ch.reject(msg, true);
             } catch (e) {
               closeOnErr(e);
             }
           });
         }, { noAck: false });
         console.log("Worker is started listening on '" + queueName + "'");
       });
     });
  };

  var connect = function(cb){
    amqp.connect(qcn, function(err, conn) {
      if (err) {
        console.error("[AMQP]", err.message);
        return setTimeout(start, 1000);
      }
      conn.on("error", function(err) {
        if (err.message !== "Connection closing") {
          console.error("[AMQP] conn error", err.message);
        }
      });
      conn.on("close", function() {
        console.error("[AMQP] reconnecting");
        return setTimeout(start, 1000);
      });
      console.log("[AMQP] connected");
      amqpConn = conn;

      amqpConn.createConfirmChannel(function(err, ch) {
         if (closeOnErr(err)) return;
           ch.on("error", function(err) {
           console.error("[AMQP] channel error", err.message);
         });
         ch.on("close", function() {
           console.log("[AMQP] channel closed");
         });

         pubChannel = ch;
         while (true) {
           var m = offlinePubQueue.shift();
           if (!m) break;
            publish(m[0], m[1], m[2]);
         }
      });

      cb({ publish : publish, registerConsume : registerConsume });
    });
  };


  var closeOnErr = function(err) {
    if (!err) return false;
    console.error("[AMQP] error", err);
    amqpConn.close();
    return true;
  };

  return {
    connect: connect
  };
};
