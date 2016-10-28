module.exports = function(config){
  return function(socket){
    //user register to listen collaborative order notice
    socket.on('register', function(data){
      if(data && data.group){
        console.log('User is registering... key: ' + config.keys.group_prefix + data.group);
        socket.join(config.keys.group_prefix + data.group)
      }
    });
  };
};
