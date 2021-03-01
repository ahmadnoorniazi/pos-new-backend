const find = require('find-process');


find('port', 3002)
  .then(function (list) {
    console.log('lololololo', list[0]);
  }, function (err) {
    console.log(err.stack || err);
  })