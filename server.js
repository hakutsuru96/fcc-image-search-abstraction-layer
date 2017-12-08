// server.js
// where your node app starts

// init project
var express = require('express');
var app = express();
var MongoClient = require('mongodb').MongoClient;
var imageService = require('./services/image')

// we've started you off with Express, 
// but feel free to use whatever libs or frameworks you'd like through `package.json`.

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// http://expressjs.com/en/starter/basic-routing.html

MongoClient.connect(process.env['MONGO_URL'], function(err, db) {
  if (err) throw err
  
  app.get("/", function (request, response) {
    response.sendFile(__dirname + '/views/index.html');
  });

  app.get("/api/imagesearch/:query", function(req, res, next) {
    var collection = db.collection('search_history')
    var params = req.params, query = params.query
    collection.insert({
      term: query,
      when: new Date()
    })
    imageService.search({
      q: query,
      offset: req.query.offset
    }, function(error, payload) {
      if (error) {
        return next(payload)
      } 
      res.json(payload)
    })
  })
  
  app.get("/api/latest/imagesearch", function(req, res) {
    var collection = db.collection('search_history')
    collection.find({}, {_id: 0}).toArray(function(err, docs) {
      res.json(docs)
    })
  })

  app.use(function(err, req, res, next) {
    res.status(err.status || 400)
    res.json(err)
  })

  // listen for requests :)
  var listener = app.listen(process.env.PORT, function () {
    console.log('Your app is listening on port ' + listener.address().port);
  });
})

