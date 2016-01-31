# tweetsWithLocation
Get tweets with geolocation from Twitter Rest API.

App makes call to Twitter search api and filters tweets with geolocation from request.
Fetched tweets are cached and stored to Redis.

## Configuration

App is configured with enviroment variables:

| Name | Value | Default value |
| --- | --- | --- |
| REDIS_URL | Redis DB URL | - |
| QUERY_CACHE_TIME | Minimum time between Twitter API calls in seconds | 60 |
| TWITTER_SEARCH_STRING | Twitter search query parameter ([Read more](https://dev.twitter.com/rest/public/search)) | 'Helsinki' |
| TWITTER_CONSUMER_KEY | App consumer key | - |
| TWITTER_CONSUMER_SECRET | App secret key | - |

## How to run
```bash
npm install
npm start
```
Open `http://localhost:3000/`

There is also `http://localhost:3000/saved` endpoint which returns tweets from cache without calling the api.

For now it's not possible to clear cache with this app. Tweets are stored in `tweets` hash.
