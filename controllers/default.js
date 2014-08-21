var models = require('../models');

//Your api key, from Mailgun’s Control Panel
var apiKey = process.env.MAILGUN_DOMAIN;

//Your domain, from the Mailgun Control Panel
var domain = process.env.MAILGUN_KEY;

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
          if (err) {
            res.json({error:{message:err}});
          }
          else {
            res.json({response:'Mensaje enviado'});
          }
        });

      }
      else {
        res.json({error:{message:'El usuario no existe'}});
      }
    }

  });
};
