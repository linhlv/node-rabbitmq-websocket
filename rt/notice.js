module.exports = function(io, config){
  var userJoined = function(data){
    if(data && data.group && data.result){
      io.to(config.keys.group_prefix + data.group).emit('collaborative-user-joined', data.result);
    }
  };

  var itemAdded = function(data){
    if(data && data.group && data.result){
      io.to(config.keys.group_prefix + data.group).emit('collaborative-item-added', data.result);
    }
  }

  return {
    userJoined: userJoined,
    itemAdded: itemAdded
  };
};
