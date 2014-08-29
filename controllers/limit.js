var models = require('../models');

module.exports = function(req, res) {
  // find customer
  models.customers.findById(req.params.id, function(err, customer) {
    if (err) {
      res.json({error:{message:err}});
    }
    else {
      if (customer) {
        var now = new Date();
        // get count log by client_id, ip address and date
        models.logs.count({
          'client_id': req.params.id,
          'ip': req.heroku.ip,
          'created_at': {
            $lte: now
          }
        }, function(err, count) {
          if (err) {
            res.json({error:{message:err}});
          }
          else if (count <= process.env.LIMIT) {
            res.json({'status':true});
          }
          else {
            res.json({'status':false});
          }
        });
      }
      else {
        res.json({error:{message:'El usuario no existe'}});
      }
    }
  });
};
