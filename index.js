var Twitter = require('twitter');
var express = require('express');

var app = express();

var client = new Twitter({
  consumer_key: 'c4bOhkKzepAdPROftmezTksJY',
  consumer_secret: 'Pags3nzuu31U7ivjxiZfEpHtBNLT9tzsLWteAh4TVzAPP2Z0Mt',
  access_token_key: '',
  access_token_secret: ''
});

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.get('/', function (req, res) {
    getTweet(function (data) { res.send(data); });
});
 
var params = {screen_name: 'nodejs'};

function getTweet(callback) {
    client.get('statuses/show/568715979498393600.json', params, function(error, tweets, response){
        if (!error) {
            callback(tweets);
        } else {
            callback('error');
        }
    });
}

app.listen(process.env.PORT || 3000, function () {
    console.log('Server started');
});
