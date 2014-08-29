var Mailgun = require('mailgun-js');
var models = require('../models');

//Your api key, from Mailgun’s Control Panel
var apiKey = process.env.MAILGUN_KEY;

//Your domain, from the Mailgun Control Panel
var domain = process.env.MAILGUN_DOMAIN;

var limit = 3;

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
          else if (count <= limit) {
            var from = req.body.from;
            var to = customer.to;
            var subject = req.body.subject;
            var message = req.body.message;

            var mailgun = new Mailgun({apiKey: apiKey, domain: domain});

            var data = {
              from: from,
              to: to,
              subject: subject,
              html: message
            };

            mailgun.messages().send(data, function(err, body) {
              var log = new models.logs;
              log.from = from;
              log.subject = subject;
              log.message = message;
              log.status = (err) ? false : true;
              log.ip = req.heroku.ip;
              log.save(function(error) {
                if (error) {
                  res.json({error:{message:error.message}});
                }
                else if (err) {
                  res.json({error:{message:err.message}});
                }
                else {
                  res.json({response:'Mensaje enviado'});
                }
              });
            });
          }
          else {
            res.json({error:{message:'No puedes enviar más de ' + limit + ' mensajes por día.'}});
          }
        });
      }
      else {
        res.json({error:{message:'El usuario no existe'}});
      }
    }

  });
};
