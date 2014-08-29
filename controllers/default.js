var Mailgun = require('mailgun-js');
var models = require('../models');

//Your api key, from Mailgun’s Control Panel
var apiKey = process.env.MAILGUN_KEY;

//Your domain, from the Mailgun Control Panel
var domain = process.env.MAILGUN_DOMAIN;

module.exports = function(req, res) {

  models.customers.findById(req.params.id, function(err, customer) {
    if (err) {
      res.json({error:{message:err}});
    }
    else {
      if (customer) {
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
          log.status = (err) ? true : false;
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
        res.json({error:{message:'El usuario no existe'}});
      }
    }

  });
};
