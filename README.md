# Topico
Topico enables you easier to show twitter hashtag comments on screen(browser). You can get feedback of audience, when you do presentation or pannel discussion. Topico tries to get new comments for every 15 seconds. When topico recognizes a new comment, inject it to timeline automatically.

![use image](https://qkwkw.github.io/readme_images/topico.jpg)

# How to use

This is front-end example. Topico gets some parameters from html element's property. It always has prefix 'tpc-'.

    <!DOCTYPE html>
    <html lang="ja"
        tpc-jsonp-url="http://example.com/topico_server.php?html5j"
        tpc-jsonp-methodname="loadTweets"
        tpc-hashtag="html5j"
        >
    <head>
      <title>Sample</title>
      <script src="js/topico.js"></script>
    </head>
    <body>
    	<h1>HTML5 Talk</h1>
    </body>
    </html>

- tpc-jsonp-url : Twitter hashtag comments generate server. 'topico_server.php' is also contained to this repository. Put it on HTTP Server and set the URL to this property.
- tpc-jsonp-methodname : Server-side scripts 'topico_server.php' generates JSONP-formatted data. Just set 'loadTweets'. If you customize server-side scripts and change method name. Set it to this property.
- tpc-hashtag : Twitter hashtag name. If unset this property, hashtags on the timeline are visibled.
- tpc-polling-span : (optional) Polling span time by millisecond. Default value is 15000.
- tpc-animate-duration : (optional) Animation time by millisecond. Default value is 15000.
- tpc-position : (optional) Position of timeline. You can use 'left' and 'right'. Default value is 'left'.

The server-side script 'topico_server.php' generates twitter hashtag coments. Put it on HTTP public directory which can work PHP, and give executable permission(like `chmod 757 ./topico_server.php`). Set your twitter application key to line 10-13.

    $CONSUMER_KEY        = "xxxxxxxxxxxxxxxxxxxxx";
    $CONSUMER_SECRET     = "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx";
    $ACCESS_TOKEN        = "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx";
    $ACCESS_TOKEN_SECRET = "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx";

If you don't know what it is, see this article https://code.google.com/p/socialauth-android/wiki/Twitter. Access via browser. Put hashtag name to query string.

    http://xxxxx/topico_server.php?hashtag

