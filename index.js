var Twitter = require('twitter');
var express = require('express');
var redis = require('redis');
var _ = require('lodash');

var app = express();
var redisClient = redis.createClient(process.env.REDIS_URL);

var client = new Twitter({
    consumer_key: process.env.TWITTER_CONSUMER_KEY,
    consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
    access_token_key: '',
    access_token_secret: ''
});

var cacheTime = process.env.QUERY_CACHE_TIME || 60; // Minimum time between Twitter api requests in seconds.
var queryStr = process.env.TWITTER_SEARCH_STRING || 'Helsinki'; // Query parameter for Twitter api call.
var allowedOrigin = process.env.ALLOW_ORIGIN || '*'; // Access-Control-Allow-Origin header value.

app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', allowedOrigin);
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});

// Get tweets
app.get('/', function (req, res) {
    var requestTimestamp = parseInt(new Date().getTime() / 1000);

    redisClient.get('api_call_timestamp', (err, lastTimestamp) => {
        if (lastTimestamp && (requestTimestamp - lastTimestamp) < cacheTime) {
            console.log('Served from cache');
            getRedisTweets(tweets => res.send(tweets));
        } else {
            console.log('API call');
            getTweets(data => res.send(data));
        }
    });
});

// Show only tweets that are saved in Redis.
app.get('/saved', function (req, res) {
    getRedisTweets(data => res.send(data));
});
 
var params = {
    q: queryStr,
    result_type: 'recent',
    count: 100
};

/**
 * Get tweets from API and Redis.
 */
function getTweets(callback) {
    client.get('search/tweets.json', params, function(error, tweets, response){
        if (!error) {
            var tweetsWithGeo = [];
            var responseTimestamp = parseInt(new Date().getTime() / 1000);

            redisClient.set('api_call_timestamp', responseTimestamp);

            tweets.statuses.forEach(tweet => {
                if (tweet.geo) {
                    tweetsWithGeo.push(tweet);
                    redisClient.hset('tweets', tweet.id, JSON.stringify(tweet));
                }
            });

            getRedisTweets(savedTweets => {
                var combinedTweets = _.unionBy(savedTweets, tweetsWithGeo, 'id');

                callback(combinedTweets);
            });
        } else {
            console.log(error);
            callback('error');
        }
    });
}

/**
 * Gets tweets stored in Redis.
 */
function getRedisTweets(callback) {
    var tweetObjects = [];

    redisClient.hgetall('tweets', function (err, obj) {
        for (var key in obj) {
            tweetObjects.push(JSON.parse(obj[key]));
        }

        callback(tweetObjects);
    });
}

app.listen(process.env.PORT || 3000, function () {
    console.log('Server started');
});
