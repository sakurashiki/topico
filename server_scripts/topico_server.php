<?php
  /*******************************************
   * topico_server.php
   * https://github.com/qkwkw/topico
   * Copyright (c) 2015 Sakurashiki
   * Released under the MIT license
   */

   // twitter keys for OAuth2.
   $CONSUMER_KEY        = "xxxxxxxxxxxxxxxxxxxxx";
   $CONSUMER_SECRET     = "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx";
   $ACCESS_TOKEN        = "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx";
   $ACCESS_TOKEN_SECRET = "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx";

   // validate parameters.
   $hashtag = $_SERVER['QUERY_STRING'];
   if (!( $hashtag && preg_match('/^[a-zA-Z0-9]{1,20}$/',$hashtag) )) {
     exit();
   }

   // authenticate twitter account.
   require "twitteroauth/autoload.php";
   use Abraham\TwitterOAuth\TwitterOAuth;
   $connection = new TwitterOAuth($CONSUMER_KEY,$CONSUMER_SECRET,$ACCESS_TOKEN,$ACCESS_TOKEN_SECRET);
   $content = $connection->get("account/verify_credentials");

   // get Hashtag search results.
   $res = $connection->get("search/tweets", array(
       "q" => "#".$hashtag,
       "result_type" => "mixed"
   ));

   // print json string.
   //  !!! json_encode() is broken, so print row json-formated string. !!!
   $list   = ((array)($res->{"statuses"}));
   $length = count($list);
   echo "loadTweets('[";
   for( $i=0 ; $i<$length ; $i++ ) {
     if( $i ) {
       echo ",";
     }
     echo '{"id":'.$list[$i]->{"id"}.',';
     echo '"user_id":"'.$list[$i]->{"user"}->{"screen_name"}.'",';
     echo '"user_img":"'.$list[$i]->{"user"}->{"profile_image_url"}.'",';
     $value = $list[$i]->{"text"};
     $value = str_replace('"' ,'',$value);
     $value = str_replace('\\','',$value);
     $value = str_replace("\n",'',$value);
     echo '"text":"'.($value).'"}';
   }
   echo "]');";
?>