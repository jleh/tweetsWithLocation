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
    getTweet(data => res.send(data));
});
 
var params = {q: 'Helsinki', result_type: 'recent', count: 100};

function getTweet(callback) {
     client.get('search/tweets.json', params, function(error, tweets, response){
        if (!error) {
            var tweetsWithGeo = [];

            tweets.statuses.forEach(tweet => {
                if (tweet.geo) {
                    tweetsWithGeo.push(tweet);
                }
            });

            callback(tweetsWithGeo);
        } else {
            callback('error');
        }
    });
}

app.listen(process.env.PORT || 3000, function () {
    console.log('Server started');
});
